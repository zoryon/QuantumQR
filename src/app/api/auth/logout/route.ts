import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isLoggedIn } from "@/lib/session";

export async function GET() {
    if (!(await isLoggedIn())) {
        return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    // Delete session from cookies
    (await cookies()).delete("session_token");
    return NextResponse.json({ success: true }, { status: 200 });
}