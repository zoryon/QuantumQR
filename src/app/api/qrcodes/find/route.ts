import { getPrismaClient } from "@/lib/db";
import { QRCodeTypes } from "@/types/QRCodeType";
import { NextResponse } from "next/server";

/**
 * Handles retrieving a specific QR code by ID and type.
 *
 * - Extracts query parameters (`id` and `type`) from the request URL.
 * - Validates the `id` and `type` values.
 * - Fetches the base QR code record from the database.
 * - Retrieves type-specific data based on the provided `type`.
 * - Combines and returns the structured response.
 *
 * @param {Request} req - The incoming request object.
 * @returns {Promise<NextResponse>} A JSON response containing the requested QR code data or an error message.
 */
export async function GET(req: Request): Promise<NextResponse> {
    const prisma = getPrismaClient();

    // Extract query parameters from request URL
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type") as QRCodeTypes | null;

    // Validate ID parameter
    const qrCodeId = Number(id);
    if (isNaN(qrCodeId)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Validate Type parameter
    if (!type) {
        return NextResponse.json({ error: "Type is required" }, { status: 400 });
    }

    try {
        // Retrieve the base QR code record
        const baseQr = await prisma.qrcodes.findUnique({
            where: { id: qrCodeId },
        });

        if (!baseQr) {
            return NextResponse.json({ error: "QR Code not found" }, { status: 404 });
        }

        // Retrieve type-specific data
        let specificData;
        switch (type) {
            case "vCards":
                specificData = await prisma.vcardqrcodes.findUnique({
                    where: { qrCodeId: baseQr.id },
                });
                break;
            case "classics":
                specificData = await prisma.classicqrcodes.findUnique({
                    where: { qrCodeId: baseQr.id },
                });
                break;
            // Add other cases here
            // case 'url':
            //     specificData = await prisma.urlqrcodes.findUnique(...);
            //     break;

            default:
                return NextResponse.json({ error: "Unsupported QR code type" }, { status: 400 });
        }

        // If no type-specific data is found, return an error
        if (!specificData) {
            return NextResponse.json({ error: "Detailed data not found" }, { status: 404 });
        }

        // Build typed response
        const response = {
            ...baseQr,
            type: type,
            ...specificData,
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Error fetching QR code:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}