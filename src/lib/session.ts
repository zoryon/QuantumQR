"use server";

import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = new TextEncoder().encode(process.env.SESSION_SECRET!);

// Used for creating a session
export async function createSignedSessionToken(userId: number, expr?: string): Promise<string> {
    const alg = "HS256";
    return await new SignJWT({ userId })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime(expr ? expr : "7d")
        .sign(secretKey);
}

// Validate a session
export async function verifySession(token: string | undefined) {
    try {
        if (!token) throw new Error("No session token provided");

        const { payload }: { payload: JWTPayload } = await jwtVerify(token, secretKey);
        return payload; // The decoded payload (e.g., { userId, iat, exp })
    } catch (error) {
        console.error("Error verifying session token: ", error);
        return null;
    }
}

export async function isLoggedIn() {
    const sessionToken = (await cookies()).get("session_token")?.value;
    const session = await verifySession(sessionToken);

    if (!session) return false;

    return session.userId ? true : false;
}