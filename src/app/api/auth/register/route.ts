import { createConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        if (typeof username !== "string" || typeof password !== "string" || !username.trim() || !password.trim()) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        if (password.length < 5) {
            return NextResponse.json(
                { error: "Password must be at least 5 characters" },
                { status: 400 }
            );
        }

        const db = await createConnection();

        // Executing sql's select statement (avoiding SQL injection)
        // Looking for the same exesisting username
        const [result] = await db.execute(
            'SELECT id FROM users WHERE username = ?',
            [username]
        );

        if (Array.isArray(result) && result.length > 0) {
            return NextResponse.json(
                { error: "Username already exists" },
                { status: 409 }
            );
        }

        // Hashing the password to be stored in the DB
        const hashedPasswd = await bcrypt.hash(password, 10);

        // Executing sql's insert statement (avoiding SQL injection)
        await db.execute(`
                INSERT INTO users(username, password) 
                VALUES (?, ?)
                `,
            [username, hashedPasswd]
        );

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}