import getPrismaClient from '@/lib/db';
import { verifySession } from '@/lib/session';
import { cookies } from 'next/headers';
import { ResponseHandler } from '@/lib/ResponseHandler';
import { NextResponse } from 'next/server';

/**
 * Handles retrieving a specific QR code by ID and type.
 */
export async function GET(req: Request): Promise<NextResponse> {
    try {
        const sessionToken = (await cookies()).get('session_token')?.value;
        const session = await verifySession(sessionToken);

        const { searchParams } = new URL(req.url);
        const id = Number(searchParams.get('id'));
        const type = searchParams.get('type');

        if (isNaN(id)) {
            return ResponseHandler.badRequest('Invalid QR code ID');
        }

        if (!type) {
            return ResponseHandler.badRequest('Type parameter is required');
        }

        const prisma = getPrismaClient();

        const baseQr = await prisma.qr_codes.findUnique({ where: { id } });

        if (!baseQr) {
            return ResponseHandler.notFound('QR Code not found');
        }

        let specificData;

        switch (type) {
            case 'vCards':
                specificData = await prisma.vcard_qr_codes.findUnique({
                    where: { qrCodeId: baseQr.id }
                });
                break;

            case 'classics':
                specificData = await prisma.classic_qr_codes.findUnique({
                    where: { qrCodeId: baseQr.id }
                });
                break;

            default:
                return ResponseHandler.badRequest('Unsupported QR code type');
        }

        if (!specificData) {
            return ResponseHandler.notFound('Detailed data not found');
        }

        const isOwner = session?.userId === baseQr.userId;

        const response = isOwner
            ? { ...baseQr, type, ...specificData, isOwner }
            : { url: baseQr.url, type, ...specificData, isOwner };

        return ResponseHandler.success('QR Code found', response);
    } catch (error) {
        console.error('Error fetching QR code:', error);
        return ResponseHandler.error(error);
    }
}
