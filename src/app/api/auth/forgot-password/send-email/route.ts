import getPrismaClient from "@/lib/db";
import transporter, { createSignedResetToken } from "@/lib/mailer";
import { ResponseHandler } from "@/lib/ResponseHandler";
import { NextResponse } from "next/server";
import { isLoggedIn } from "@/lib/auth-helpers";

/**
 * Handles the POST request to initiate the password reset process.
 */
export async function POST(req: Request): Promise<NextResponse> {
    try {
        if (await isLoggedIn()) {
            return ResponseHandler.unauthorized("You are already logged in");
        }

        const { emailOrUsername } = await req.json();

        if (typeof emailOrUsername !== "string" || !emailOrUsername.trim()) {
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

        const resetToken = await createSignedResetToken(user.id, "10m");
        const link = `${process.env.WEBSITE_URL}/forgot-password?token=${resetToken}`;

        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: user.email,
            subject: "Reset your password",
            html: `<p>Reset: <a href="${link}">Click here</a></p>`,
        });

        return ResponseHandler.success(true, "Please check your email to reset your password.");
    } catch (error) {
        return ResponseHandler.error(error);
    }
}
