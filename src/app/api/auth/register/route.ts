import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import getPrismaClient from "@/lib/db";
import { isLoggedIn } from "@/lib/session";
import transporter, { createSignedConfirmationToken } from "@/lib/mailer";
import { ResultType } from "@/types/ResultType";

export async function POST(req: Request) {
    try {
        if (await isLoggedIn()) {
            return NextResponse.json<ResultType>({ 
                success: false,
                message: "You are already logged in."
            }, { status: 401 });
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
            return NextResponse.json<ResultType>({ 
                success: false,
                message: "Invalid parameters."
            }, { status: 400 });
        }

        if (username.length < 2) {
            return NextResponse.json<ResultType>({ 
                success: false,
                message: "Username must be at least 2 characters long."
            }, { status: 400 });
        }

        if (password.length < 5) {
            return NextResponse.json<ResultType>({ 
                success: false,
                message: "Password must be at least 5 characters long."
            }, { status: 400 });
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
            return NextResponse.json<ResultType>({ 
                success: false,
                message: "User already exists. Please login instead."
            }, { status: 409 });
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
                isEmailConfirmed: false
            },
        });

        if (!user) {
            return NextResponse.json<ResultType>({ 
                success: false,
                message: "An error occurred on our end. Please try again later."
            }, { status: 500 });
        }

        // Preparing confirmation email
        const validationToken = await createSignedConfirmationToken(user.id, "10m")
        const link = `${process.env.WEBSITE_URL}/register/confirm?token=${validationToken}`;

        // Sending confirmation email
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: user.email,
            subject: "Confirm Your Email",
            html: `<p>Confirm: <a href="${link}">Click here</a></p>`,
        });

        return NextResponse.json<ResultType>({ 
            success: true,
            message: "Registration successful. Please check your email to confirm your account."
        }, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json<ResultType>({ 
            success: false,
            message: error
        }, { status: 500 });
    }
}