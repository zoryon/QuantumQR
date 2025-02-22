

import { getPrismaClient } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function VCardPage({
    params: paramsPromise,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const params = await paramsPromise;
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
    const prisma = getPrismaClient();
    
    const vcard = await prisma.vcardqrcodes.findUnique({
        where: { qrCodeId: qrCodeId },
    });
    if (!vcard) {
        return notFound();
    }

    const qrcode = await prisma.qrcodes.findUnique({
        where: { id: vcard.qrCodeId },
    });
    if (!qrcode) {
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