import getPrismaClient from "@/lib/db";
import { validateConfirmationToken } from "@/lib/mailer";
import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    // If user is logged-in -> block access
    const sessionToken = (await cookies()).get("session_token")?.value;
    const session = await verifySession(sessionToken);

    if (session?.userId) {
        return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    // If user is not logged-in -> confirm email
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    const confirmedToken = await validateConfirmationToken(token || "");

    if (!confirmedToken?.userId) {
        return NextResponse.json({ error: "Not authorized" }, { status: 401 });
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
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
}