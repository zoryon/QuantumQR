import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import getPrismaClient from '@/lib/db';
import { TYPE_MAPPING } from '@/constants';
import { QrCodeFlexible } from '@/types';
import { ResponseHandler } from '@/lib/ResponseHandler';
import { verifySession } from '@/lib/session';
import { isBanned } from '@/lib/auth-helpers';

/**
 * Retrieves all QR codes belonging to the authenticated user,
 * including their type-specific data based on dynamic relation mapping.
 */
export async function GET(): Promise<NextResponse> {
    try {
        const sessionToken = (await cookies()).get('session_token')?.value;
        const session = await verifySession(sessionToken);

        if (!session?.userId) {
            return ResponseHandler.unauthorized('You are not logged in or your session has expired');
        }

        const userId = Number(session.userId);

        if (await isBanned(userId)) {
            return ResponseHandler.forbidden('You are currently under a ban');
        }

        const prisma = getPrismaClient();

        const includeRelations: Record<string, boolean> = {};
        TYPE_MAPPING.forEach(mapping => {
            includeRelations[mapping.relation] = true;
        });

        const qrCodes = await prisma.qr_codes.findMany({
            where: { userId },
            include: includeRelations,
            orderBy: { createdAt: 'asc' },
        });

        const formatted: QrCodeFlexible[] = qrCodes.map(qr => {
            const entry: QrCodeFlexible = {
                id: Number(qr.id),
                userId: Number(qr.userId),
                name: qr.name,
                url: qr.url,
                scans: Number(qr.scans),
                createdAt: qr.createdAt!,
                updatedAt: qr.updatedAt!,
                type: 'classics', // fallback default
            };

            for (const { relation, type } of TYPE_MAPPING) {
                const relatedData = (qr as any)[relation];

                if (relatedData && typeof relatedData === 'object') {
                    entry.type = type;

                    for (const key in relatedData) {
                        if (Object.hasOwn(relatedData, key) && key !== 'qrCodeId') {
                            entry[key] = relatedData[key];
                        }
                    }

                    break;
                }
            }

            return entry;
        });

        return ResponseHandler.success('QR codes retrieved successfully', formatted);
    } catch (error) {
        console.error('API Error fetching QR codes:', error);
        return ResponseHandler.error(error);
    }
}
