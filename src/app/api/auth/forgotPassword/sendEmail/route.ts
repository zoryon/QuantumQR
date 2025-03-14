import getPrismaClient from "@/lib/db";
import transporter, { createSignedResetToken } from "@/lib/mailer";
import { isLoggedIn } from "@/lib/session";
import { ResultType } from "@/types/ResultType";
import { NextResponse } from "next/server";

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
        const { emailOrUsername } = await req.json();

        if (typeof emailOrUsername !== "string" || !emailOrUsername.trim()) {
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

        // Send email with link to reset password
        // Preparing reset email
        const resetToken = await createSignedResetToken(user.id, "10m")
        const link = `${process.env.WEBSITE_URL}/forgot-password?token=${resetToken}`;

        // Sending reset email
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: user.email,
            subject: "Reset your password",
            html: `<p>Reset: <a href="${link}">Click here</a></p>`,
        });

        return NextResponse.json<ResultType>({
            success: true,
            message: "Please check your email to reset your password.",
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