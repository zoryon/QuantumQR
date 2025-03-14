import { DEFAULT_EXPIRATION, JWT_ALGORITHM } from "@/constants/mailerConstants";
import { JWTPayload, jwtVerify, SignJWT } from "jose";
import nodemailer from "nodemailer";

interface TokenPayload extends JWTPayload {
    userId: number;
}

// Load secret key from environment variable
const mailerSecretKey = new TextEncoder().encode(process.env.MAILER_SECRET!);
const resetSecretKey = new TextEncoder().encode(process.env.RESET_SECRET!);

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

// Token generation and validation utilities
const createToken = async (
    secret: Uint8Array,
    userId: number,
    expiration: string = DEFAULT_EXPIRATION
): Promise<string> => {
    return await new SignJWT({ userId })
        .setProtectedHeader({ alg: JWT_ALGORITHM })
        .setIssuedAt()
        .setExpirationTime(expiration)
        .sign(secret);
};

const validateToken = async (
    secret: Uint8Array,
    token?: string
): Promise<TokenPayload | null> => {
    try {
        if (!token) throw new Error("No token provided");

        const { payload } = await jwtVerify(token, secret);
        return payload as TokenPayload;
    } catch (error) {
        console.error(`Token validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return null;
    }
};

// Specific token functions
export const createSignedConfirmationToken = (userId: number, expiration?: string) => 
    createToken(mailerSecretKey, userId, expiration);

export const validateConfirmationToken = (token?: string) => 
    validateToken(mailerSecretKey, token);

export const createSignedResetToken = (userId: number, expiration?: string) => 
    createToken(resetSecretKey, userId, expiration);

export const validateResetToken = (token?: string) => 
    validateToken(resetSecretKey, token);

export default transporter;