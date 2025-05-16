import getPrismaClient from "@/lib/db";
import { validateResetToken } from "@/lib/mailer";
import { ResponseHandler } from "@/lib/ResponseHandler";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { isLoggedIn } from "@/lib/auth-helpers";

/**
 * Handles the POST request for resetting a user's password using a valid reset token.
 */
export async function POST(req: Request): Promise<NextResponse> {
    try {
        if (await isLoggedIn()) {
            return ResponseHandler.unauthorized("You are already logged in.");
        }

        const { token, password, passwordConfirmation } = await req.json();

        if (!token || typeof token !== "string") {
            return ResponseHandler.badRequest("Reset token is required.");
        }

        if (
            typeof password !== "string" ||
            typeof passwordConfirmation !== "string" ||
            !password.trim() ||
            !passwordConfirmation.trim()
        ) {
            return ResponseHandler.badRequest("Malformed data.");
        }

        if (password.length < 4) {
            return ResponseHandler.badRequest("Password must be at least 4 characters long.");
        }

        if (password !== passwordConfirmation) {
            return ResponseHandler.badRequest("Passwords do not match.");
        }

        const confirmedToken = await validateResetToken(token);
        if (!confirmedToken?.userId) {
            return ResponseHandler.unauthorized("Invalid token.");
        }

        const prisma = getPrismaClient();

        const updatedUser = await prisma.users.update({
            where: {
                id: confirmedToken.userId,
                isEmailConfirmed: true,
            },
            data: {
                password: await bcrypt.hash(password, 10),
            },
        });

        if (!updatedUser) {
            return ResponseHandler.notFound("User not found.");
        }

        return ResponseHandler.success(null, "Password updated successfully.");
    } catch (error) {
        return ResponseHandler.error(error);
    }
}
