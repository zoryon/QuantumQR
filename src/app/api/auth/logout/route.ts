import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/session";

export async function GET() {
    // If user is not logged-in -> block access
    const sessionToken = (await cookies()).get("session_token")?.value;
    const session = await verifySession(sessionToken);

    if (!session?.userId) {
        return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    // Delete session from cookies
    (await cookies()).delete("session_token");
    return NextResponse.json({ success: true }, { status: 200 });
}