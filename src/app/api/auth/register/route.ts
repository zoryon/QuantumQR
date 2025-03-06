import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import getPrismaClient from "@/lib/db";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/session";

export async function POST(req: Request) {
    try {
        // If user is logged-in -> block access
        const sessionToken = (await cookies()).get("session_token")?.value;
        const session = await verifySession(sessionToken);

        if (session?.userId) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }

        // If user is not logged-in -> create a new user
        const prisma = getPrismaClient();
        const { email, username, password, hasAllowedEmails } = await req.json();

        // Validating params
        if (
            typeof email !== "string" || 
            typeof username !== "string" || 
            typeof password !== "string" || 
            typeof hasAllowedEmails !== "boolean" ||
            !email.trim() || 
            !username.trim() || 
            !password.trim() ||
            hasAllowedEmails === undefined ||
            hasAllowedEmails === null
        ) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        if (password.length < 5) {
            return NextResponse.json({ error: "Password must be at least 5 characters" }, { status: 400 });
        }

        // Executing sql's select statement (avoiding SQL injection)
        // Looking for the same exisisting email or username
        let user = await prisma.users.findFirst({
            where: {
                OR: [
                    { email: email.trim() },
                    { username: username.trim() }
                ]
            }
        });

        if (user) {
            return NextResponse.json({ error: "Username already exists" }, { status: 409 } );
        }

        // Hashing the password to be stored in the DB
        const hashedPasswd = await bcrypt.hash(password, 10);

        // Executing sql"s insert statement (avoiding SQL injection)
        user = await prisma.users.create({
            data: {
                email,
                username,
                password: hashedPasswd,
                hasAllowedEmails: hasAllowedEmails || false,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
        }

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message },{ status: 500 });
    }
}