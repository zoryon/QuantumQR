import { JWTPayload, jwtVerify, SignJWT } from "jose";
import nodemailer from "nodemailer";

// Load secret key from environment variable
const secretKey = new TextEncoder().encode(process.env.MAILER_SECRET!);

// Configure transporter (gmail)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true, // (SSL)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

// Verify transporter on startup (optional)
transporter.verify((error) => {
    if (error) {
        console.error("SMTP connection error: ", error);
    } else {
        console.log("SMTP server is ready to send emails");
    }
});

export default transporter;


// Create a signed confirmation token
export async function createSignedConfirmationToken(userId: number, expr?: string): Promise<string> {
    const alg = "HS256";
    return await new SignJWT({ userId })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime(expr ? expr : "10m")
        .sign(secretKey);
}

export async function validateConfirmationToken(token: string | undefined) {
    try {
        if (!token) throw new Error("No confirmation token provided");

        const { payload }: { payload: JWTPayload } = await jwtVerify(token, secretKey);
        return payload; // The decoded payload (e.g., { userId, iat, exp })
    } catch (error) {
        console.error("Error confirming token: ", error);
        return null;
    }
}