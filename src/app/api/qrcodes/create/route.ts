import {
    cardDetailsFormSchema,
    classicDetailsFormSchema,
} from '@/lib/schemas';
import { QRCodeTypes } from '@/types';
import { generateQRCode } from '@/lib/qrcode';
import { ROUTER_URL } from '@/constants';
import { ResponseHandler } from '@/lib/ResponseHandler';
import getPrismaClient from '@/lib/db';
import { NextResponse } from 'next/server';
import { verifyActiveUserSession } from '@/lib/auth-helpers';
import { DuplicateEntryError } from '@/lib/custom-errors';

const prisma = getPrismaClient();

/**
 * Handles QR code creation (vCards or classic URLs).
 */
export async function POST(req: Request): Promise<NextResponse> {
    try {
        // Verify active session and get user ID
        const authCheck = await verifyActiveUserSession();
        if (authCheck instanceof NextResponse) return authCheck;
        const { userId } = authCheck;

        if (!userId) {
            return ResponseHandler.unauthorized('You are not logged in');
        }

        const { qrType, ...values } = await req.json();

        if (!qrType?.trim()) {
            return ResponseHandler.badRequest('Invalid input: qrType is required');
        }

        if (values.name?.trim().length < 2) {
            return ResponseHandler.badRequest('Name must be at least 2 characters long');
        }

        if (values.name?.trim().length > 20) {
            return ResponseHandler.badRequest('Name must be less than 20 characters long');
        }

        const [subscription, userQRCodeCount] = await prisma.$transaction([
            prisma.subscriptions.findFirst({
                where: { userId },
                include: { tiers: true }
            }),
            prisma.qr_codes.count({
                where: { userId }
            })
        ]);

        if (!subscription || !subscription.tiers?.maxQRCodes) {
            return ResponseHandler.internalServerError('Subscription or tier limit not found');
        }

        if (userQRCodeCount >= subscription.tiers.maxQRCodes) {
            return ResponseHandler.forbidden('You have reached your QR code limit for this subscription tier');
        }

        let result;
        switch (qrType as QRCodeTypes) {
            case 'vCards':
                result = await handleVCard(userId, values);
                break;
            case 'classics':
                result = await handleClassic(userId, values);
                break;
            default:
                return ResponseHandler.badRequest('Invalid QR code type');
        }

        return ResponseHandler.success('QR code created successfully', result);
    } catch (error: any) {
        console.error('QR Code Creation Error:', error);
        return ResponseHandler.error(error);
    }
}

/**
 * Creates a vCard QR code entry in the database.
 */
async function handleVCard(userId: number, values: any) {
    const parsed = cardDetailsFormSchema.safeParse(values);
    if (!parsed.success) {
        throw parsed.error;
    }

    const validatedData = parsed.data;

    await assertUniqueName(userId, validatedData.name);

    const qrCode = await prisma.qr_codes.create({
        data: {
            name: validatedData.name,
            userId,
            url: '',
            vcard_qr_codes: {
                create: {
                    firstName: validatedData.firstName,
                    lastName: validatedData.lastName,
                    phoneNumber: validatedData.phoneNumber,
                    email: validatedData.email,
                    address: validatedData.address,
                    websiteUrl: validatedData.websiteUrl,
                }
            }
        },
        include: { vcard_qr_codes: true }
    });

    const dynamicURL = `${process.env.WEBSITE_URL!}/q/vcards/${qrCode.id}`;
    const qrCodeURL = await generateQRCode(dynamicURL);

    return await prisma.qr_codes.update({
        where: { id: qrCode.id },
        data: { url: qrCodeURL },
        include: { vcard_qr_codes: true }
    });
}

/**
 * Creates a classic QR code entry in the database.
 */
async function handleClassic(userId: number, values: any) {
    const parsed = classicDetailsFormSchema.safeParse(values);
    if (!parsed.success) {
        throw parsed.error;
    }

    const validatedData = parsed.data

    await assertUniqueName(userId, validatedData.name);

    const qrCode = await prisma.qr_codes.create({
        data: {
            name: validatedData.name,
            userId,
            url: '',
            classic_qr_codes: {
                create: {
                    targetUrl: validatedData.targetUrl
                }
            }
        },
        include: { classic_qr_codes: true }
    });

    const qrCodeURL = await generateQRCode(`${ROUTER_URL}/classics/${qrCode.id}`);

    return await prisma.qr_codes.update({
        where: { id: qrCode.id },
        data: { url: qrCodeURL },
        include: { classic_qr_codes: true }
    });
}

/**
 * Ensures the QR code name is unique for the user.
 * @throws DuplicateEntryError if the name already exists.
 */
async function assertUniqueName(userId: number, name: string) {
    const exists = await prisma.qr_codes.findFirst({
        where: { userId, name }
    });

    if (exists) {
        throw new DuplicateEntryError('A QR Code with the same name already exists');;
    }
}
