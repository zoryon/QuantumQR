"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Handles the logout process by clearing the authentication cookie
 * and redirecting the user to the login page.
 *
 * - Deletes the `session_token` cookie to invalidate the session.
 * - Redirects the user to the `/login` page after logout.
 * - Catches and logs any potential errors.
 *
 * @throws {Error} If an error occurs during the logout process.
 */
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