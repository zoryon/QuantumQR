import { NextResponse, type NextRequest } from "next/server";
import { verifySession } from "./lib/session";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("session_token")?.value;
    const isAuthenticated = await verifySession(token || "");

    // Handle register & login page access
    if (req.nextUrl.pathname === "/register" || req.nextUrl.pathname === "/login") {
        return isAuthenticated
            ? NextResponse.redirect(new URL("/", req.url))
            : NextResponse.next();
    }

    // Handle register & login (auth) api access
    if (req.nextUrl.pathname.startsWith("/api/auth")) {
        return isAuthenticated
            ? NextResponse.redirect(new URL("/", req.url))
            : NextResponse.next();
    }

    // Protect all other routes
    if (!isAuthenticated) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
        */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
}