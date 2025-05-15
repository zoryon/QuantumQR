import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import getPrismaClient from "@/lib/db";
import { verifySession, isBanned } from "@/lib/session";
import { ResultType } from "@/types";

/**
 * Handles username change for the currently authenticated user.
 * 
 * - Validates session via cookie.
 * - Checks if user is banned.
 * - Validates new username.
 * - Updates username in the database.
 * - Returns appropriate success or error response.
 * 
 * @returns {Promise<NextResponse<ResultType>>}
 */
export async function POST(req: Request): Promise<NextResponse<ResultType>> {
    try {
        // 1. Extract session token from cookies
        const sessionToken = (await cookies()).get("session_token")?.value;
        const session = await verifySession(sessionToken);

        if (!session?.userId) {
            return NextResponse.json({
                message: "You are not logged in or your session has expired",
                success: false,
                data: null,
            }, { status: 401 });
        }

        const userId = session.userId as number;

        // 2. Check ban status
        const banned = await isBanned(userId);
        if (banned) {
            return NextResponse.json({
                message: "You are currently under a ban",
                success: false,
                data: null,
            }, { status: 403 });
        }

        // 3. Parse and validate body
        const body = await req.json();
        const username = body?.username;

        if (!username || typeof username !== "string" || username.trim() === "") {
            return NextResponse.json({
                message: "New username is missing",
                success: false,
                data: null,
            }, { status: 400 });
        }

        if (username.length > 20) {
            return NextResponse.json({
                message: "Username must be equal or less than 20 characters",
                success: false,
                data: null,
            }, { status: 400 });
        }

        const prisma = getPrismaClient();

        // 4. Update username
        const result = await prisma.users.updateMany({
            where: { id: userId },
            data: { username },
        });

        if (result.count !== 1) {
            return NextResponse.json({
                message: "User doesn't exist or is banned",
                success: false,
                data: null,
            }, { status: 400 });
        }

        // 5. Success
        return NextResponse.json({
            message: "Changed name successfully",
            success: true,
            data: null,
        }, { status: 200 });

    } catch (error) {
        console.error("API Error changing username:", error);
        return NextResponse.json({
            message: "Internal server error",
            success: false,
            data: null,
        }, { status: 500 });
    }
}
