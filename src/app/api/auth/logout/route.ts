import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ResponseHandler } from "@/lib/ResponseHandler";
import { isLoggedIn } from "@/lib/auth-helpers";

/**
 * Handles the GET request for logging out the user.
 */
export async function GET(): Promise<NextResponse> {
    if (!(await isLoggedIn())) {
        return ResponseHandler.unauthorized("Not authorized");
    }

    (await cookies()).delete("session_token");

    return ResponseHandler.success("Logged out successfully", true);
}
