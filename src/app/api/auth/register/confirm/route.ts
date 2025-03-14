import getPrismaClient from "@/lib/db";
import { validateConfirmationToken } from "@/lib/mailer";
import { isLoggedIn } from "@/lib/session";
import { ResultType } from "@/types/ResultType";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    if (await isLoggedIn()) {
        return NextResponse.json<ResultType>({ 
            success: false,
            message: "You are already logged in.",
            body: null
        }, { status: 401 });
    }

    // If user is not logged-in -> confirm email
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    const confirmedToken = await validateConfirmationToken(token || "");

    if (!confirmedToken?.userId) {
        return NextResponse.json<ResultType>({ 
            success: false,
            message: "Invalid token.",
            body: null
        }, { status: 401 });
    }

    const prisma = getPrismaClient();

    // update isEmailConfirmed to true
    const updatedUser = await prisma.users.update({
        where: {
            id: confirmedToken.userId as number
        },
        data: {
            isEmailConfirmed: true
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
        message: "Email confirmed successfully.",
        body: null
    }, { status: 200 });
}