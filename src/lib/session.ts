"use server";

import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import getPrismaClient from "./db";

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

/**
 * Function to check if a user is logged in based on the session token stored in cookies.
 * - Retrieves the session token from cookies.
 * - Validates the session token using the verifySession function.
 * 
 * @returns A promise that resolves to true if the user is logged in (valid session), otherwise false.
 */
export async function isLoggedIn() {
    const sessionToken = (await cookies()).get("session_token")?.value; // Retrieve the session token from cookies
    const session = await verifySession(sessionToken); // Verify the session token

    if (!session) return false;

    return session.userId ? true : false; // Return true if the session has a user ID, otherwise false
}

/**
 * Checks if a user is currently banned.
 *
 * This implementation assumes a database table (or Prisma model)
 * exists to list banned user IDs (e.g., a 'BannedUser' model
 * where the 'id' field corresponds to the user's ID).
 *
 * @param userId The ID of the user to check.
 * @returns A promise that resolves to true if the user is banned, false otherwise.
 */
export async function isBanned(userId: number): Promise<boolean> {
    try {
        const prisma = getPrismaClient();

        // Query the database to see if a record exists for this userId
        // in the table/model representing banned users.
        // Assuming a model named 'BannedUser' exists with an 'id' field
        // corresponding to the user ID.
        const bannedUser = await prisma.banned_users.findUnique({
            where: {
                userId: userId,
            },
            select: { userId: true } 
        });

        // If bannedUser is not null, it means a record was found, so the user is banned.
        return bannedUser !== null;

        // Alternative using count:
        /*
        const bannedCount = await prisma.bannedUser.count({
             where: {
                 id: userId,
             },
        });
        return bannedCount > 0;
        */

    } catch (error) {
        console.error(`Error checking ban status for user ${userId}:`, error);
        // Depending on requirements, you might want to throw the error,
        // or return false (safer if DB is down, doesn't ban users incorrectly).
        // Returning false here mimics the behavior if the selectOne in PHP failed.
        return false;
    }
}