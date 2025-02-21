import { cardDetailsFormSchema } from "@/lib/schemas";
import { QRCodeTypes } from "@/types/QRCode";
import { NextResponse } from "next/server";
import { z } from "zod";
import QRCode from "qrcode";
import getPrismaClient from "@/lib/db";

const prisma = getPrismaClient();

export async function POST(req: Request) {
    const {
        qrType,
        ...values
    } = await req.json();

    if (!qrType.trim()) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    switch (qrType as QRCodeTypes) {
        case "vCard":
            const parsedValues = cardDetailsFormSchema.parse(values);
            await createVCardQRCode(parsedValues);
            break;
        default:
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
}

async function createVCardQRCode(values: z.infer<typeof cardDetailsFormSchema>) {
    // Generate vCard content from the form values
    const vCardContent = `
        BEGIN:VCARD
        VERSION:3.0
        FN:${values.firstName} ${values.lastName}
        EMAIL:${values.email}
        TEL:${values.phoneNumber}
        ADR:${values.address}
        END:VCARD
    `;

    try {
        const qrCodeURL = await QRCode.toDataURL(vCardContent);

        // Create the QR code entry in the database
        const qrCode = await prisma.qrcodes.create({
            data: {
                name: `${values.firstName} ${values.lastName} vCard`,
                userId: 1,
                vcardqrcodes: {
                    create: {
                        firstName: values.firstName,
                        lastName: values.lastName,
                        phoneNumber: values.phoneNumber,
                        email: values.email,
                        address: values.address,
                        website: "https://example.com",
                    }
                }
            }
        });

        console.log("QR Code created:", qrCodeURL, qrCode); 
    } catch (err) {
        console.error("Error generating or saving QR code:", err);
    }
}