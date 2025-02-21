import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { cookies } from 'next/headers';
import { User } from "@/types/User";
import { createSignedSessionToken } from "@/lib/session";

console.log("blyat")
export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        if (typeof username !== "string" || typeof password !== "string" || !username.trim() || !password.trim()) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        const db = await createConnection();

        // executing sql's select statement (avoiding SQL injection)
        const [result] = await db.execute(`
                SELECT * 
                FROM users AS u
                WHERE u.username = ?
                `,
            [username.trim()]
        );

        if (!Array.isArray(result)) throw new Error("Database error");
        if (result.length === 0) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // fetching user from the returned rows
        const user = result[0] as User;
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
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
