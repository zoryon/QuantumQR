import { JWTPayload, SignJWT, jwtVerify } from 'jose';

const secretKey = new TextEncoder().encode(process.env.SESSION_SECRET!);

export async function createSignedSessionToken(userId: number): Promise<string> {
    const alg = 'HS256';
    return await new SignJWT({ userId })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(secretKey);
}

export async function verifySession(token: string) {
    try {
        const { payload }: { payload: JWTPayload } = await jwtVerify(token, secretKey);
        return payload; // The decoded payload (e.g., { userId, iat, exp })
    } catch (error) {
        console.error("Error verifying session token: ", error);
        return null;
    }
}