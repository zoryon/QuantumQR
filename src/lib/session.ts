"use server";

import { JWTPayload, SignJWT, jwtVerify } from "jose";

// Secret key for signing and verifying JWT tokens (session tokens)
const secretKey = new TextEncoder().encode(process.env.SESSION_SECRET!);

/**
 * Function to create a signed session token for a user.
 * - Uses a user ID to create a JWT payload.
 * - Sets the expiration time of the token (default is 7 days if not provided).
 * - Signs the token with the secret key for security.
 * 
 * @param userId - The user ID to include in the JWT payload.
 * @param expr - Optional expiration time for the token (default is "7d").
 * @returns A promise that resolves to the signed JWT token.
 */
export async function createSignedSessionToken(userId: number, expr?: string): Promise<string> {
    const alg = "HS256";
    return await new SignJWT({ userId }) // Set user ID as part of the payload
        .setProtectedHeader({ alg }) // Set the algorithm in the JWT header
        .setIssuedAt() // Set the issued at timestamp (iat)
        .setExpirationTime(expr ? expr : "7d")
        .sign(secretKey); // Sign the token using the secret key
}

/**
 * Function to validate the session token.
 * - Verifies if the provided token is valid using the secret key.
 * - If valid, returns the decoded JWT payload.
 * - If invalid, returns null.
 * 
 * @param token - The session token to verify.
 * @returns The decoded JWT payload if the token is valid, otherwise null.
 */
export async function verifySession(token: string | undefined) {
    try {
        if (!token) throw new Error("No session token provided");

        // Verify the token using the secret key and extract the payload
        const { payload }: { payload: JWTPayload } = await jwtVerify(token, secretKey);
        return payload; // Return the decoded payload (e.g., user ID, issue date, expiration date)
    } catch (error) {
        console.error("Error verifying session token: ", error);
        return null;
    }
}
