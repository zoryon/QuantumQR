import getPrismaClient from "@/lib/db";
import { verifySession } from "@/lib/session";
import { QRCode } from "@/types/QRCodeType";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const typeMappings = [
    { relation: "vcardqrcodes", type: "vCards" as const },
    { relation: "classicqrcodes", type: "classic" as const },
];

export async function GET() {
    try {
        // If user is not logged-in -> block access
        const sessionToken = (await cookies()).get("session_token")?.value;
        const session = await verifySession(sessionToken);

        if (!session?.userId) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }

        const prisma = getPrismaClient();

        // Dynamically build include object
        const include = typeMappings.reduce((acc, mapping) => {
            acc[mapping.relation] = true;
            return acc;
        }, {} as Record<string, boolean>);

        // Fetch QR codes with all possible relations
        const qrCodes = await prisma.qrcodes.findMany({
            where: { userId: Number(session.userId) },
            include: {
                ...include,
            },
        });

        if (!qrCodes) {
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }

        // Transform results into typed response
        const typedQRCodes = qrCodes.map((qr): QRCode => {
            for (const mapping of typeMappings) {
                const relationData = qr[mapping.relation];
                if (relationData) {
                    return {
                        ...qr,
                        type: mapping.type,
                        ...(typeof relationData === 'object' && relationData !== null ? relationData : {}),
                        qrCodeId: Number((relationData as any).qrCodeId),
                    } as QRCode;
                }
            }

            return {
                ...qr,
                type: "unknown",
            } as unknown as QRCode;
        });

        // Safe number conversion
        const safeQRCodes = typedQRCodes.map(qr => ({
            ...qr,
            id: Number(qr.id),
            userId: Number(qr.userId),
            scans: Number(qr.scans),
            ...("qrCodeId" in qr && { qrCodeId: Number(qr.qrCodeId) }),
        }));

        return NextResponse.json(safeQRCodes, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}