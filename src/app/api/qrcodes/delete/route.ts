import { ResponseHandler } from "@/lib/ResponseHandler";
import { verifyActiveUserSession } from "@/lib/auth-helpers";
import getPrismaClient from "@/lib/db";
import { z } from "zod";
import { NextResponse } from "next/server";

const DeleteSchema = z.object({
    ids: z.array(z.number().int().positive()),
});

export async function DELETE(req: Request): Promise<NextResponse> {
    try {
        // Verify session and ban status
        const authCheck = await verifyActiveUserSession();
        if (authCheck instanceof NextResponse) return authCheck;
        const { userId } = authCheck;

        // Parse and validate body
        const body = await req.json();
        const parsed = DeleteSchema.safeParse(body);

        if (!parsed.success) {
            return ResponseHandler.badRequest(
                "Missing or invalid QR code IDs. Expected an array of positive integers."
            );
        }

        const { ids } = parsed.data;
        if (ids.length === 0) {
            return ResponseHandler.badRequest("No valid QR code IDs provided");
        }

        const prisma = getPrismaClient();

        const result = await prisma.qr_codes.deleteMany({
            where: {
                id: { in: ids },
                userId,
            },
        });

        if (result.count === 0) {
            return ResponseHandler.success(
                0,
                "No matching QR codes found for deletion or you do not have permission for the provided IDs"
            );
        }

        return ResponseHandler.success(
            result.count,
            `${result.count} QR code(s) deleted successfully`
        );
    } catch (error) {
        return ResponseHandler.error(error);
    }
}
