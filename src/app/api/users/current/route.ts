import getPrismaClient from "@/lib/db";
import { verifySession } from "@/lib/session";
import { omit } from "@/lib/utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // getting user session from cookies
        const sessionToken = (await cookies()).get("session_token")?.value;
        const session = await verifySession(sessionToken);

        if (!session?.userId) {
            return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
        }

        // if session is valid -> get user from database
        const prisma = getPrismaClient();
        const user = await prisma.users.findUnique({
            where: {
                id: session.userId as number,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // destructuring user object to remove sensitive data
        const publicData = omit(user, ["id", "password"]);
        
        // return user's public data
        return NextResponse.json(publicData, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
