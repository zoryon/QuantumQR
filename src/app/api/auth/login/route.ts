import getPrismaClient from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { createSignedSessionToken } from "@/lib/session";
import { ResponseHandler } from "@/lib/ResponseHandler";
import { isLoggedIn } from "@/lib/auth-helpers";

/**
 * Handles the POST request for logging in a user.
 */
export async function POST(req: Request): Promise<NextResponse> {
    try {
        if (await isLoggedIn()) {
            return ResponseHandler.unauthorized("You are already logged in");
        }

        const { emailOrUsername, password } = await req.json();

        if (
            typeof emailOrUsername !== "string" ||
            !emailOrUsername.trim() ||
            typeof password !== "string" ||
            !password.trim()
        ) {
            return ResponseHandler.badRequest("Invalid credentials");
        }

        const prisma = getPrismaClient();

        const user = await prisma.users.findFirst({
            where: {
                OR: [
                    { email: emailOrUsername.trim() },
                    { username: emailOrUsername.trim() },
                ],
                isEmailConfirmed: true,
            },
        });

        if (!user) {
            return ResponseHandler.unauthorized("Invalid email or username");
        }

        const isMatching = await bcrypt.compare(password, user.password);
        if (!isMatching) {
            return ResponseHandler.unauthorized("Invalid password");
        }

        const newSessionToken = await createSignedSessionToken(user.id);

        const expires = new Date();
        expires.setDate(expires.getDate() + 7);

        (await cookies()).set("session_token", newSessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            expires,
            path: "/",
        });

        return ResponseHandler.success("Logged in successfully", true);
    } catch (error) {
        return ResponseHandler.error(error);
    }
}
