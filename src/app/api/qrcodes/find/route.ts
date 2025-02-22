import getPrismaClient from "@/lib/db";
import { verifySession } from "@/lib/session";
import { QRCode } from "@/types/QRCodeType";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const sessionToken = (await cookies()).get("session_token")?.value;
        const session = await verifySession(sessionToken || "");

        if (!session?.userId) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }

        const prisma = getPrismaClient();

        // Fetch QR codes with all possible relations
        const qrCodes = await prisma.qrcodes.findMany({
            where: { userId: session.userId as number },
            include: {
                vcardqrcodes: true,
                // Add other includes here as you create new types
            },
        });

        if (!qrCodes) {
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }

        // Transform results into typed response
        const typedQRCodes: QRCode[] = qrCodes.map((qr: {
            name: string;
            id: number;
            userId: number;
            url: string;
            createdAt: Date | null;
            updatedAt: Date | null;
        } & {
            vcardqrcodes: {
                qrCodeId: number;
                firstName: string;
                lastName: string;
                phoneNumber: string | null;
                email: string | null;
                websiteUrl: string | null;
                address: string | null;
            } | null
        }) => {
            if (qr.vcardqrcodes) {
                return {
                    ...qr,
                    type: "vcard",
                    ...qr.vcardqrcodes,
                };
            }

            // Add other type checks here

            // Fallback for unknown types (shouldn't happen if DB is properly maintained)
            return {
                ...qr,
                type: "unknown",
            } as any;
        });

        const safeQRCodes = typedQRCodes.map(qr => ({
            ...qr,
            id: Number(qr.id),
            userId: Number(qr.userId),
            qrCodeid: Number(qr.qrCodeId)
        }));

        return NextResponse.json(safeQRCodes, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}