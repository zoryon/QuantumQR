import { NextResponse } from "next/server"
import getPrismaClient from "@/lib/db";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/session";
import { ResultType } from "@/types/ResultType";
import { TYPE_MAPPING } from "@/constants/qrCodes";
import { PrismaModel } from "@/types/prisma";

export async function PUT(request: Request) {
    try {
        // if not logged-in -> block access
        const sessionToken = (await cookies()).get("session_token")?.value;
        const session = await verifySession(sessionToken);

        if (!session?.userId) {
            return NextResponse.json<ResultType>({
                success: false,
                message: "Unauthorized",
                body: null
            }, { status: 401 });
        }

        const body = await request.json();
        const { id, type, ...values } = body;

        const prisma = getPrismaClient();

        // Find the correct type mapping
        const mapping = TYPE_MAPPING.find(m => m.type === type)
        if (!mapping) {
            return NextResponse.json<ResultType>({
                success: false,
                message: "Invalid QR code type",
                body: null
            }, { status: 400 });
        }

        // Validate with correct schema
        const validatedData = mapping.schema.parse(values);

        const { name, ...data} = validatedData;

        const existingQRCode = await prisma.qrcodes.findFirst({
            where: {
                userId: Number(session.userId),
                name: name,
            }
        });

        if (existingQRCode && existingQRCode.name === name) {
            return NextResponse.json<ResultType>({
                success: false,
                message: "A QR Code with the same name already exists",
                body: null
            }, { status: 400 });
        }

        // Transaction for atomic update
        const transaction = [
            // Update main QR code record
            prisma.qrcodes.update({
                where: {
                    id: Number(id),
                    userId: Number(session.userId)
                },
                data: { 
                    name: name,
                    updatedAt: new Date()
                }
            }),

            // Update type-specific table
            (prisma[mapping.model as PrismaModel] as any).update({
                where: { qrCodeId: Number(id) },
                data: data,
            }),
        ];

        if (!transaction) {
            return NextResponse.json<ResultType>({
                success: false,
                message: "Malformed request",
                body: null
            }, { status: 400 });
        }
        const result = await prisma.$transaction(transaction);

        return NextResponse.json<ResultType>({
            success: true,
            message: "QR Code updated successfully",
            body: result
        }, { status: 200 });
    } catch (error) {
        console.error("Error updating: ", error);
        return NextResponse.json<ResultType>({
            success: false,
            message: "Internal server error",
            body: null
        }, { status: 500 });
    }
}