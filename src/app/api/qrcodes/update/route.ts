import { NextResponse } from 'next/server'
import { editVCardFormSchema } from '@/lib/schemas'
import getPrismaClient from '@/lib/db';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/session';

export async function PUT(request: Request) {
    try {
        // if not logged-in -> block access
        const sessionToken = (await cookies()).get("session_token")?.value;
        const session = await verifySession(sessionToken);

        if (!session?.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        // Zod validation
        const validatedData = editVCardFormSchema.parse(body);

        const prisma = getPrismaClient();

        // Check if the vCard exists
        const existingVCard = await prisma.vcardqrcodes.findUnique({
            where: { qrCodeId: validatedData.id },
            include: { qrcodes: true }
        });

        if (!existingVCard) {
            return NextResponse.json({ error: "vCard non trovata" }, { status: 404 });
        }

        // Transaction to update both tables
        const result = await prisma.$transaction([
            prisma.qrcodes.update({
                where: {
                    id: validatedData.id,
                    userId: session.userId
                },
                data: {
                    updatedAt: new Date(),
                    name: `${validatedData.firstName} ${validatedData.lastName}`,
                }
            }),
            prisma.vcardqrcodes.update({
                where: { qrCodeId: validatedData.id },
                data: {
                    firstName: validatedData.firstName,
                    lastName: validatedData.lastName,
                    phoneNumber: validatedData.phoneNumber || null,
                    email: validatedData.email || null,
                    websiteUrl: validatedData.websiteUrl || null,
                    address: validatedData.address || null
                }
            })
        ]);

        return NextResponse.json({
            success: true,
            message: "vCard aggiornata con successo",
            data: result
        }, { status: 200 });
    } catch (error) {
        console.error('Errore durante l\'aggiornamento:', error);
        return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
    }
}