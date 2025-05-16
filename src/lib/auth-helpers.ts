import { cookies } from "next/headers";
import getPrismaClient from "./db";
import { verifySession } from "./session";
import { ResponseHandler } from "./ResponseHandler";
import { UserRole } from "@/types";

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
        return false;
    }
}

export async function verifyActiveUserSession(requiredRole?: UserRole) {
    const sessionToken = (await cookies()).get("session_token")?.value;
    const session = await verifySession(sessionToken);

    const userId: number = session?.userId as number;
    if (!userId) return ResponseHandler.unauthorized();
    
    if (await isBanned(userId as number)) {
        return ResponseHandler.forbidden("You are currently banned");
    }

    const prisma = getPrismaClient();
    
    const user = await prisma.users.findUnique({
        where: { 
            id: userId, 
            isEmailConfirmed: true, 
        },
    });

    if (!user) return ResponseHandler.notFound();

    if (requiredRole && user.role !== requiredRole) return ResponseHandler.forbidden("Admin access is required");

    return { userId: userId };
}