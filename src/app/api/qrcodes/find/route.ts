import { getPrismaClient } from "@/lib/db";
import { QRCodeTypes, VCardResponse } from "@/types/QRCodeType";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const prisma = getPrismaClient();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type") as QRCodeTypes | null;

    const qrCodeId = Number(id);
    if (isNaN(qrCodeId)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    if (!type) {
        return NextResponse.json({ error: "Type is required" }, { status: 400 });
    }

    try {
        // 1. Find base QR code info
        const baseQr = await prisma.qrcodes.findUnique({
            where: { id: qrCodeId },
        });

        if (!baseQr) {
            return NextResponse.json({ error: "QR Code not found" }, { status: 404 });
        }

        // 2. Determine type and fetch specific data
        let specificData;
        switch (type) {
            case "vCards":
                specificData = await prisma.vcardqrcodes.findUnique({
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

        if (!specificData) {
            return NextResponse.json({ error: "Detailed data not found" }, { status: 404 });
        }

        // 3. Build typed response
        const response: VCardResponse = {
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