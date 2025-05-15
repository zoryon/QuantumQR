import { NextResponse } from "next/server";
import getPrismaClient from "@/lib/db";
import { cookies } from "next/headers";
import { verifySession, isBanned } from "@/lib/session";
import { UPDATE_TYPE_MAPPING } from "@/constants";
import { ResultType, PrismaModel } from "@/types";

export async function PUT(request: Request): Promise<NextResponse<ResultType>> {
    try {
        const sessionToken = (await cookies()).get("session_token")?.value;
        const session = await verifySession(sessionToken);

        if (!session?.userId) {
            return NextResponse.json({ success: false, message: "Unauthorized", data: null }, { status: 401 });
        }

        if (await isBanned(session?.userId as number)) {
            return NextResponse.json({ success: false, message: "You are currently under a ban", data: null }, { status: 403 });
        }

        const body = await request.json();
        const { id, type, ...values } = body;

        if (!id || !type) {
            return NextResponse.json({ success: false, message: "Missing ID or type", data: null }, { status: 400 });
        }

        const mapping = UPDATE_TYPE_MAPPING[type as keyof typeof UPDATE_TYPE_MAPPING];
        if (!mapping) {
            return NextResponse.json({ success: false, message: "Invalid QR code type", data: null }, { status: 400 });
        }

        let validatedData;
        try {
            validatedData = mapping.schema.parse(values);
        } catch (e: any) {
            return NextResponse.json({ success: false, message: "Validation failed", data: e.errors }, { status: 400 });
        }

        const { name, ...typeSpecificFields } = validatedData;

        const prisma = getPrismaClient();
        const trimmedName = typeof name === "string" ? name.trim() : name;

        const duplicate = await prisma.qr_codes.findFirst({
            where: {
                userId: session.userId,
                name: trimmedName,
                NOT: { id: Number(id) }
            }
        });

        if (duplicate) {
            return NextResponse.json({ success: false, message: "QR code name already exists", data: null }, { status: 400 });
        }

        const transaction = [
            prisma.qr_codes.update({
                where: { id: Number(id), userId: session.userId },
                data: { name: trimmedName, updatedAt: new Date() }
            }),
            (prisma[mapping.model as PrismaModel] as any).update({
                where: { qrCodeId: Number(id) },
                data: typeSpecificFields
            })
        ];

        const result = await prisma.$transaction(transaction);

        return NextResponse.json({
            success: true,
            message: "QR code updated successfully",
            data: result
        }, { status: 200 });

    } catch (error: any) {
        console.error("Update failed:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error",
            data: null
        }, { status: 500 });
    }
}
