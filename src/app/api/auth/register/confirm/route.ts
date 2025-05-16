import getPrismaClient from "@/lib/db";
import { validateConfirmationToken } from "@/lib/mailer";
import { ResponseHandler } from "@/lib/ResponseHandler";
import { ResultType } from "@/types";
import { NextResponse } from "next/server";
import { isLoggedIn } from "@/lib/auth-helpers";

export async function GET(req: Request): Promise<NextResponse<ResultType>> {
    try {
        // Prevent confirmation if already logged in
        if (await isLoggedIn()) {
            return ResponseHandler.unauthorized("You are already logged in.");
        }

        // Extract token from query parameters
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token") || "";

        // Validate token and get userId
        const confirmedToken = await validateConfirmationToken(token);

        if (!confirmedToken?.userId) {
            return ResponseHandler.unauthorized("Invalid token.");
        }

        const prisma = getPrismaClient();

        // Update user's email confirmation status
        const updatedUser = await prisma.users.update({
            where: { id: confirmedToken.userId },
            data: { isEmailConfirmed: true },
        });

        if (!updatedUser) {
            return ResponseHandler.notFound("User not found.");
        }

        return ResponseHandler.success(null, "Email confirmed successfully.");
    } catch (error) {
        return ResponseHandler.error(error);
    }
}
