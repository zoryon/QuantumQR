import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import getPrismaClient from "@/lib/db";
import { verifySession, isBanned } from "@/lib/session";
import { z } from "zod";
import { ResultType } from "@/types";

const DeleteSchema = z.object({
    ids: z.array(z.number().int().positive())
});

export async function DELETE(request: Request): Promise<NextResponse<ResultType>> {
    try {
        const sessionToken = (await cookies()).get("session_token")?.value;
        const session = await verifySession(sessionToken);

        if (!session?.userId) {
            return NextResponse.json({ success: false, message: "You are not logged in or your session has expired", data: null }, { status: 401 });
        }

        if (await isBanned(session?.userId as number)) {
            return NextResponse.json({ success: false, message: "You are currently under a ban", data: null }, { status: 403 });
        }

        const body = await request.json();

        let parsed;
        try {
            parsed = DeleteSchema.parse(body);
        } catch (e: any) {
            return NextResponse.json({ success: false, message: "Missing or invalid QR code IDs. Expected an array of positive integers.", data: e.errors }, { status: 400 });
        }

        const { ids } = parsed;

        if (ids.length === 0) {
            return NextResponse.json({ success: false, message: "No valid QR code IDs provided", data: null }, { status: 400 });
        }

        const prisma = getPrismaClient();

        const deleteResult = await prisma.qr_codes.deleteMany({
            where: {
                id: { in: ids },
                userId: session.userId
            }
        });

        if (deleteResult.count === 0) {
            return NextResponse.json({
                success: true,
                message: "No matching QR codes found for deletion or you do not have permission for the provided IDs",
                data: 0
            }, { status: 200 });
        }

        return NextResponse.json({
            success: true,
            message: `${deleteResult.count} QR code(s) deleted successfully`,
            data: deleteResult.count
        }, { status: 200 });

    } catch (error: any) {
        console.error("QR code deletion failed:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error",
            data: null
        }, { status: 500 });
    }
}
