// src/app/api/user/route.ts (Example API route path)

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import getPrismaClient from "@/lib/db"; // Assuming this provides your Prisma client
import { verifySession } from "@/lib/session"; // Assuming this handles session verification
import { isBanned } from "@/lib/session"; // Assuming you have a function to check ban status
import { ResultType } from "@/types"; // Assuming your standard result type

/**
 * Handles the retrieval of the currently authenticated user's detailed information,
 * including subscription tier and QR code statistics.
 *
 * - Extracts the session token from cookies.
 * - Verifies the session to ensure the user is authenticated and gets the user ID.
 * - Checks if the user is banned.
 * - Fetches the user, their subscription tier, QR code count, and total scan count
 * using Prisma queries.
 * - Combines the data into a single object.
 * - Removes sensitive fields (e.g., `password`) before returning the data.
 * - Returns the sanitized user information or an appropriate error response (401, 403, 404, 500).
 *
 * @returns {Promise<NextResponse<ResultType>>} A JSON response containing the user's
 * detailed data or an error message.
 */
export async function GET(): Promise<NextResponse<ResultType>> { // Using <any> for data type flexibility based on combined result
    try {
        // 1. Check HTTP method (Next.js API routes handle this by function name,
        //    but explicit check is good for clarity or if handling multiple methods in one file)
        //    Since this is `GET`, it only responds to GET requests by default.

        // 2. Check for an existing session and get the user ID
        const sessionToken = (await cookies()).get("session_token")?.value;
        const session = await verifySession(sessionToken);

        if (!session?.userId) {
            // Unauthorized if no valid session or user ID
            return NextResponse.json({
                message: "You are not logged in or your session has expired",
                success: false,
                data: null
            }, { status: 401 }); // Changed from 400 to 401 to match PHP
        }

        const userId = session.userId as number; // Cast to number if Prisma uses number IDs

        // 3. Check if the user is banned
        const userIsBanned = await isBanned(userId); // Assuming isBanned checks the ban status
        if (userIsBanned) {
             return NextResponse.json({
                 message: "You are currently under a ban",
                 success: false,
                 data: null
             }, { status: 403 }); // Forbidden
        }

        // 4. Database Interaction - Replicate the PHP query logic using Prisma
        const prisma = getPrismaClient();

        // Fetch user details, including subscription and tier name via relations
        // We use select to explicitly pick fields, similar to fetching u.* but safer,
        // and include relations for subscription and tier.
        const userWithDetails = await prisma.users.findUnique({ // Assuming your user model is named 'User'
            where: {
                id: userId,
            },
            select: {
                id: true, 
                role: true,
                email: true,
                username: true,
                createdAt: true,
                updatedAt: true,
                subscriptions: { 
                    select: {
                        tiers: {
                            select: {
                                name: true 
                            }
                        }
                    }
                }
            },
        });

        // If user not found (shouldn't happen after session check, but good practice)
        if (!userWithDetails) {
            return NextResponse.json({
                message: "User data not found", // More specific than just 'User not found'
                success: false,
                data: null
            }, { status: 404 });
        }

        // Fetch QR code count for this user
        const qrCodesCount = await prisma.qr_codes.count({ // Assuming your QR code model is named 'QrCode'
            where: {
                userId: userId,
            },
        });

        // Fetch total scans for QR codes belonging to this user using aggregation
        const qrCodesAggregation = await prisma.qr_codes.aggregate({
            _sum: {
                scans: true,
            },
            where: {
                userId: userId,
            },
        });

        // Use COALESCE equivalent: if _sum.scans is null (no scans), default to 0
        const totalScans = qrCodesAggregation._sum.scans ?? 0;

        // 5. Combine the fetched data
        const rawUserData = {
            ...userWithDetails, 
            tier: userWithDetails.subscriptions[0].tiers.name, 
            qrCodesCount: qrCodesCount,
            totalScans: totalScans,
        };

        // Clean up the combined object: remove nested subscription/tier objects
        // and sensitive fields like password if they were selected initially.
        const publicUserData = {
            id: rawUserData.id,
            email: rawUserData.email,
            username: rawUserData.username,
            createdAt: rawUserData.createdAt,
            updatedAt: rawUserData.updatedAt,
            tier: rawUserData.tier, // Already extracted
            qrCodesCount: rawUserData.qrCodesCount,
            totalScans: rawUserData.totalScans,
            role: rawUserData.role
        };

        // 6. Send success response
        return NextResponse.json({
            message: "User data retrieved successfully",
            success: true,
            data: publicUserData
        }, { status: 200 });
    } catch (error) {
        console.error("API Error fetching user data:", error);
        // 8. Handle errors
        return NextResponse.json({
            message: "Internal server error",
            success: false,
            data: null 
        }, { status: 500 });
    }
}