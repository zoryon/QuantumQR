import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
    (await cookies()).delete("session_token");
    return NextResponse.json({ success: true }, { status: 200 });
}