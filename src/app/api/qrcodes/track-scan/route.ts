import { ResponseHandler } from "@/lib/ResponseHandler";
import getPrismaClient from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * Handles updating the scan count for a QR code.
 *
 * - Extracts the QR code `id` from the request body.
 * - Validates the `id` to ensure it is a valid number.
 * - Increments the `scans` count for the corresponding QR code in the database.
 * - Returns the updated scan count in the response.
 *
 * @param {Request} req - The incoming PUT request containing the QR code `id` in the body.
 * @returns {Promise<NextResponse>} A JSON response with the updated scan count or an error message.
 */
export async function PUT(req: Request): Promise<NextResponse> {
    try {
        const { id } = await req.json();

        const qrCodeId = Number(id);
        if (isNaN(qrCodeId)) {
            return ResponseHandler.badRequest("Invalid QR code ID");
        }

        const prisma = getPrismaClient();

        const updated = await prisma.qr_codes.update({
            where: { id: qrCodeId },
            data: {
                scans: { increment: 1 },
            },
            select: { scans: true },
        });

        return ResponseHandler.success({ scans: updated.scans }, "Scan count updated");
    } catch (error) {
        console.error("Error updating scan count:", error);
        return ResponseHandler.error(error);
    }
}