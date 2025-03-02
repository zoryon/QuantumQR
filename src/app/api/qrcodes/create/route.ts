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
    try {
        // If user is not logged-in -> block access
        const sessionToken = (await cookies()).get("session_token")?.value;
        const session = await verifySession(sessionToken);
        if (!session?.userId) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }

        // Fetching the request body (dividing the QR type from the rest of the values, which are the qr code's data)
        const {
            qrType,
            ...values
        } = await req.json();

        if (!qrType.trim()) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        // Creating the QR code based on the type
        switch (qrType as QRCodeTypes) {
            case "vCards":
                const parsedValues = cardDetailsFormSchema.parse(values);
                await createVCardQRCode({ 
                    userId: session.userId as number, 
                    values: parsedValues 
                });
                break;
            default:
                return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

async function createVCardQRCode({
    userId,
    values
}: {
    userId: number,
    values: z.infer<typeof cardDetailsFormSchema>
}) {
    try {
        // Create the QR code entry in the database
        const qrCode = await prisma.qrcodes.create({
            data: {
                name: values.name,
                userId: userId,
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