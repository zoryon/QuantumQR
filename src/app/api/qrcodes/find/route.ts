import getPrismaClient from "@/lib/db";
import { verifySession } from "@/lib/session";
import { QRCode } from "@/types/QRCodeType";
import { qrcodes, vcardqrcodes } from "@prisma/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const sessionToken = (await cookies()).get("session_token")?.value;
        const session = await verifySession(sessionToken || "");

        if (!session) {
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
            return NextResponse.json({ error: "No QR codes found" }, { status: 404 });
        }

        // Transform results into typed response
        const typedQRCodes: QRCode[] = qrCodes.map((qr: qrcodes & { vcardqrcodes: vcardqrcodes | null }) => {
            if (qr.vcardqrcodes) {
                return {
                    ...qr,
                    type: 'vcard',
                    ...qr.vcardqrcodes,
                };
            }

            // Add other type checks here
            // ...

            // Fallback for unknown types (shouldn't happen if DB is properly maintained)
            return {
                ...qr,
                type: 'unknown',
            } as any;
        });

        return NextResponse.json(typedQRCodes, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}