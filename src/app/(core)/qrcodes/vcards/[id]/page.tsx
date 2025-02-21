

import { getPrismaClient } from '@/lib/db';
import { verifySession } from '@/lib/session';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

export default async function VCardPage({ params }: { params: { id: string } }) {
    const { id } = params;
    if (!id) {
        return notFound();
    }

    const qrCodeId = Number(id);

    // Validate the ID
    if (isNaN(qrCodeId)) {
        return notFound();
    }

    // Get session token and verify session
    const sessionToken = (await cookies()).get('session_token')?.value;
    const session = await verifySession(sessionToken || "");
    if (!session) {
        return redirect("/login");
    }

    const prisma = getPrismaClient();
    
    const vcard = await prisma.vcardqrcodes.findUnique({
        where: { qrCodeid: qrCodeId },
    });
    if (!vcard) {
        return notFound();
    }

    const qrcode = await prisma.qrcodes.findUnique({
        where: { id: vcard.qrCodeid },
    });
    if (!qrcode || session.userId !== qrcode.userId) {
        return notFound();
    }

    if (!vcard) {
        return <div>VCard not found</div>;
    }

    return (
        <div>
            <h1>vCard Information</h1>
            <p>Name: {vcard.firstName} {vcard.lastName}</p>
            <p>Email: {vcard.email}</p>
            <p>Phone: {vcard.phoneNumber}</p>
            <p>Address: {vcard.address}</p>
            <p>Website: {vcard.websiteUrl}</p>
        </div>
    );
}