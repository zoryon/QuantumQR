import getPrismaClient from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { cookies } from 'next/headers';
import { createSignedSessionToken } from "@/lib/session";

export async function POST(req: Request) {
    try {
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

        // fetching user from the returned rows
        const isMatching = await bcrypt.compare(password, user.password);
        if (!isMatching) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // creating a valid session token
        const sessionToken = await createSignedSessionToken(user.id);

        // creating a one-week-session cookie
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        (await cookies()).set('session_token', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires,
            path: '/',
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 } );
    }
}
