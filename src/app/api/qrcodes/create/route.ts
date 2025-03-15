import { cardDetailsFormSchema, CardDetailsFormValues, classicDetailsFormSchema, ClassicDetailsFormValues } from "@/lib/schemas";
import { QRCodeTypes } from "@/types/QRCodeType";
import { NextResponse } from "next/server";
import { z } from "zod";
import QRCode from "qrcode";
import getPrismaClient from "@/lib/db";
import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";
import { ResultType } from "@/types/ResultType";

const prisma = getPrismaClient();

export async function POST(req: Request) {
    try {
        // If user is not logged-in -> block access
        const sessionToken = (await cookies()).get("session_token")?.value;
        const session = await verifySession(sessionToken);
        if (!session?.userId) {
            return NextResponse.json<ResultType>({
                success: false,
                message: "You are not logged in",
                body: null
            }, { status: 401 });
        }

        // Fetching the request body (dividing the QR type from the rest of the values, which are the qr code's data)
        const {
            qrType,
            ...values
        } = await req.json();

        if (!qrType.trim()) {
            return NextResponse.json<ResultType>({ 
                success: false, 
                message: "Invalid input",
                body: null
            }, { status: 400 });
        }

        if (values.name.trim().length > 20) {
            return NextResponse.json<ResultType>({ 
                success: false, 
                message: "Name must be less than 20 characters",
                body: null
            }, { status: 400 });
        }

        // Creating the QR code based on the type
        let qrCode: any = null;
        let parsedValues: any = null;
        switch (qrType as QRCodeTypes) {
            case "vCards":
                parsedValues = cardDetailsFormSchema.safeParse(values);

                if (!parsedValues.success) {
                    return NextResponse.json<ResultType>({ 
                        success: false, 
                        message: parsedValues.error.message,
                        body: null
                    }, { status: 400 });
                }
                qrCode = await createVCardQRCode({
                    userId: session.userId as number,
                    values: parsedValues.data
                });
                break;
            case "classic":
                parsedValues = classicDetailsFormSchema.safeParse(values);

                if (!parsedValues.success) {
                    return NextResponse.json<ResultType>({ 
                        success: false, 
                        message: parsedValues.error.message,
                        body: null
                    }, { status: 400 });
                }
                qrCode = await createClassicQRCode({
                    userId: session.userId as number,
                    values: parsedValues.data
                });
                break;
            default:
                return NextResponse.json<ResultType>({ 
                    success: false, 
                    message: "Invalid QR code type",
                    body: null
                }, { status: 400 });
        }

        return NextResponse.json<ResultType>({
            success: true,
            message: "QR code created successfully",
            body: qrCode
        }, { status: 200 });
    } catch (error: any) {
        console.error(error.message);
        return NextResponse.json<ResultType>({
            success: error.success,
            message: error.message,
            body: null
        }, { status: 500 });
    }
}

async function createVCardQRCode({
    userId,
    values
}: {
    userId: number,
    values: CardDetailsFormValues
}) {
    try {
        const existingQrCode = await prisma.qrcodes.findFirst({
            where: { userId, name: values.name }
        });
        
        if (existingQrCode) {
            throw new Error("A QR Code with the same name already exists");
        }

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
            },
            include: { vcardqrcodes: true }
        });

        const dynamicURL = `${process.env.WEBSITE_URL!}/qrcodes/vcards/${qrCode.id}`;

        // Generate the QR code with the dynamic URL
        const svgString = await QRCode.toString(dynamicURL, {
            type: "svg",
            color: {
                dark: "#000000",
                light: "#ffffff"
            }
        });

        const qrCodeURL = `data:image/svg+xml;base64,${Buffer.from(svgString).toString("base64")}`;

        // Update the QR code entry with the generated QR code URL
        const updatedQrCode = await prisma.qrcodes.update({
            where: { id: qrCode.id },
            data: { url: qrCodeURL },
            include: { vcardqrcodes: true }
        });

        return updatedQrCode;
    } catch (error: any) {
        console.error("Error generating or saving QR code: ", error);
        throw error;
    }
}

async function createClassicQRCode({
    userId,
    values
}: {
    userId: number,
    values: ClassicDetailsFormValues
}) {
    try {
        const existingQrCode = await prisma.qrcodes.findFirst({
            where: { userId, name: values.name }
        });
        
        if (existingQrCode) {
            throw new Error("A QR Code with the same name already exists");
        }

        // Generate the QR code with the dynamic URL
        const svgString = await QRCode.toString(values.websiteUrl, {
            type: "svg",
            color: {
                dark: "#000000",
                light: "#ffffff"
            }
        });

        const qrCodeURL = `data:image/svg+xml;base64,${Buffer.from(svgString).toString("base64")}`;

        // Create the QR code entry in the database
        const qrCode = await prisma.qrcodes.create({
            data: {
                name: values.name,
                userId: userId,
                url: qrCodeURL,
                classicqrcodes: {
                    create: {
                        websiteUrl: values.websiteUrl,
                    }
                }
            },
            include: { vcardqrcodes: true }
        });

        return qrCode;
    } catch (error: any) {
        console.error("Error generating or saving QR code: ", error);
        throw error;
    }
}