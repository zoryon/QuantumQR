import getPrismaClient from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { createSignedSessionToken, isLoggedIn } from "@/lib/session";
import { ResultType } from "@/types/ResultType";

export async function POST(req: Request) {
    try {
        if (await isLoggedIn()) {
            return NextResponse.json<ResultType>({ 
                success: false, 
                message: "You are already logged in",
                body: null
            }, { status: 401 });
        }

        // If user not logged-in -> proceed with login
        const prisma = getPrismaClient();
        const { emailOrUsername, password } = await req.json();

        if (typeof emailOrUsername !== "string" || typeof password !== "string" || !emailOrUsername.trim() || !password.trim()) {
            return NextResponse.json<ResultType>({ 
                success: false, 
                message: "Invalid credentials",
                body: null
            }, { status: 400 });
        }

        // Find user using Prisma
        const user = await prisma.users.findFirst({
            where: {  
                OR: [
                    { email: emailOrUsername.trim() },
                    { username: emailOrUsername.trim() }
                ],
                isEmailConfirmed: true
            }
        });

        if (!user) {
            return NextResponse.json<ResultType>({ 
                success: false, 
                message: "Invalid email or username",
                body: null
            }, { status: 401 });
        }

        // Fetching user from the returned rows
        const isMatching = await bcrypt.compare(password, user.password);
        if (!isMatching) {
            return NextResponse.json<ResultType>({ 
                success: false, 
                message: "Invalid password",
                body: null
            }, { status: 401 });
        }

        // Creating a valid session token
        const newSessionToken = await createSignedSessionToken(user.id);

        // Creating a one-week-session cookie
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        (await cookies()).set("session_token", newSessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            expires,
            path: "/",
        });

        return NextResponse.json<ResultType>({ 
            success: true, 
            message: "Logged in successfully",
            body: true
        }, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json<ResultType>({ 
            success: false, 
            message: error.message,
            body: null
        }, { status: 500 });
    }
}
