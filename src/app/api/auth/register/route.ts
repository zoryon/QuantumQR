import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import getPrismaClient from "@/lib/db";

export async function POST(req: Request) {
    try {
        const prisma = getPrismaClient();
        const { username, password } = await req.json();

        if (typeof username !== "string" || typeof password !== "string" || !username.trim() || !password.trim()) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        if (password.length < 5) {
            return NextResponse.json(
                { error: "Password must be at least 5 characters" },
                { status: 400 }
            );
        }

        // Executing sql"s select statement (avoiding SQL injection)
        // Looking for the same exesisting username
        let user = await prisma.users.findUnique({
            where: {
                username,
            },
        });

        if (user) {
            return NextResponse.json(
                { error: "Username already exists" },
                { status: 409 }
            );
        }

        // Hashing the password to be stored in the DB
        const hashedPasswd = await bcrypt.hash(password, 10);

        // Executing sql"s insert statement (avoiding SQL injection)
        user = await prisma.users.create({
            data: {
                username,
                password: hashedPasswd,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Failed to create user" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}