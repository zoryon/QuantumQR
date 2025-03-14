import getPrismaClient from "@/lib/db";
import { validateResetToken } from "@/lib/mailer";
import { isLoggedIn } from "@/lib/session";
import { ResultType } from "@/types/ResultType";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        if (await isLoggedIn()) {
            return NextResponse.json<ResultType>({
                success: false,
                message: "You are already logged in.",
                body: null
            }, { status: 401 });
        }

        // If user is not logged-in -> reset password
        const { token, password, passwordConfirmation } = await req.json();

        if (
            typeof password !== "string" || typeof passwordConfirmation !== "string" ||
            !password.trim() || !passwordConfirmation.trim() ||
            !token 
        ) {
            return NextResponse.json<ResultType>({
                success: false,
                message: "Malformed data.",
                body: null
            }, { status: 400 });
        }

        if (password.length < 5) {
            return NextResponse.json<ResultType>({
                success: false,
                message: "Password must be at least 6 characters long.",
                body: null
            }, { status: 400 });
        }

        if (password !== passwordConfirmation) {
            return NextResponse.json<ResultType>({
                success: false,
                message: "Passwords do not match.",
                body: null
            }, { status: 400 })
        };

        const confirmedToken = await validateResetToken(token || "");

        if (!confirmedToken?.userId) {
            return NextResponse.json<ResultType>({
                success: false,
                message: "Invalid token.",
                body: null
            }, { status: 401 });
        }

        const prisma = getPrismaClient();

        // update passwords
        const updatedUser = await prisma.users.update({
            where: {
                id: confirmedToken.userId as number,
                isEmailConfirmed: true
            },
            data: {
                password: await bcrypt.hash(password, 10)
            }
        });

        if (!updatedUser) {
            return NextResponse.json<ResultType>({
                success: false,
                message: "User not found.",
                body: null
            }, { status: 404 });
        }

        return NextResponse.json<ResultType>({
            success: true,
            message: "Password updated successfully.",
            body: null
        }, { status: 200 });
    } catch (error) {
        console.error("Error while updating passwords: ", error);
        return NextResponse.json<ResultType>({
            success: false,
            message: "Something went wrong.",
            body: null
        }, { status: 500 });
    }
}