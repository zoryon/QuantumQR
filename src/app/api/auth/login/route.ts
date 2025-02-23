import getPrismaClient from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { cookies } from 'next/headers';
import { createSignedSessionToken, verifySession } from "@/lib/session";

export async function POST(req: Request) {
    try {
        // If user is logged-in -> block access
        const sessionToken = (await cookies()).get("session_token")?.value;
        const session = await verifySession(sessionToken);

        if (session?.userId) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }

        // If user not logged-in -> proceed with login
        const prisma = getPrismaClient();
        const { username, password } = await req.json();

        if (typeof username !== "string" || typeof password !== "string" || !username.trim() || !password.trim()) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        // Find user using Prisma
        const user = await prisma.users.findUnique({
            where: { username: username.trim() }
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Fetching user from the returned rows
        const isMatching = await bcrypt.compare(password, user.password);
        if (!isMatching) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Creating a valid session token
        const newSessionToken = await createSignedSessionToken(user.id);

        // Creating a one-week-session cookie
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        (await cookies()).set('session_token', newSessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires,
            path: '/',
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
