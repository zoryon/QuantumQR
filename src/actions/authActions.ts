"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
    try {
        // Clear authentication cookie
        (await cookies()).delete("session_token");

        // Redirect to login page
        redirect("/login");
    } catch (error) {
        console.error("Logout failed:", error);
        throw error; // Re-throw to handle in client
    }
}