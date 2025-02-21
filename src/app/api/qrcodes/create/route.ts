import { cardDetailsFormSchema } from "@/lib/schemas";
import { QRCodeTypes } from "@/types/QRCodeType";
import { NextResponse } from "next/server";
import { z } from "zod";
import QRCode from "qrcode";
import getPrismaClient from "@/lib/db";
import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";

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
    try {
        const sessionToken = (await cookies()).get('session_token')?.value;
        if (!sessionToken) {
            throw new Error("Session token is missing");
        }
    
        const session = await verifySession(sessionToken);
        if (!session) {
            throw new Error("User not found");
        }

        // Create the QR code entry in the database
        const qrCode = await prisma.qrcodes.create({
            data: {
                name: values.name,
                userId: session.userId as number,
                url: "",
                vcardqrcodes: {
                    create: {
                        firstName: values.firstName,
                        lastName: values.lastName,
                        phoneNumber: values.phoneNumber,
                        email: values.email,
                        address: values.address,
                        websiteUrl: values.websiteUrl,
                    }
                }
            }
        });

        const dynamicURL = `${process.env.WEBSITE_URL!}/qrcodes/vcards/${qrCode.id}`;

        // Generate the QR code with the dynamic URL
        const qrCodeURL = await QRCode.toDataURL(dynamicURL);

        // Update the QR code entry with the generated QR code URL
        await prisma.qrcodes.update({
            where: { id: qrCode.id },
            data: { url: qrCodeURL }
        });

        console.log("QR Code created:", qrCode);
    } catch (err) {
        console.error("Error generating or saving QR code:", err);
    }
}