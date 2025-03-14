import { NextResponse } from "next/server"
import { editVCardFormSchema } from "@/lib/schemas"
import getPrismaClient from "@/lib/db";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/session";
import { ResultType } from "@/types/ResultType";

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

        // Zod validation
        const validatedData = editVCardFormSchema.parse(body);

        const prisma = getPrismaClient();

        // Check if the vCard exists
        const existingVCard = await prisma.vcardqrcodes.findUnique({
            where: { qrCodeId: validatedData.id },
            include: { qrcodes: true }
        });

        if (!existingVCard) {
            return NextResponse.json<ResultType>({
                success: false,
                message: "vCard not found",
                body: null
            }, { status: 404 });
        }

        // Transaction to update both tables
        const result = await prisma.$transaction([
            prisma.qrcodes.update({
                where: {
                    id: validatedData.id,
                    userId: session.userId
                },
                data: {
                    updatedAt: new Date(),
                }
            }),
            prisma.vcardqrcodes.update({
                where: { qrCodeId: validatedData.id },
                data: {
                    firstName: validatedData.firstName,
                    lastName: validatedData.lastName,
                    phoneNumber: validatedData.phoneNumber || null,
                    email: validatedData.email || null,
                    websiteUrl: validatedData.websiteUrl || null,
                    address: validatedData.address || null
                }
            })
        ]);

        return NextResponse.json<ResultType>({
            success: true,
            message: "vCard updated successfully",
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