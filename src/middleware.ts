import { NextResponse, type NextRequest } from "next/server";
import { verifySession } from "./lib/middlewareHelpers";

export async function middleware(request: NextRequest) {
    const sessionToken = request.cookies.get("session_token")?.value;
    const session = sessionToken ? await verifySession(sessionToken) : null;
    const isAuthenticated = !!session?.id;

    // Handle register & login page access
    if (request.nextUrl.pathname === "/register" || request.nextUrl.pathname === "/login") {
        return isAuthenticated
            ? NextResponse.redirect(new URL("/", request.url))
            : NextResponse.next();
    }

    // Handle register & login (auth) api access
    if (request.nextUrl.pathname.startsWith("/api/auth")) {
        return isAuthenticated
            ? NextResponse.redirect(new URL("/", request.url))
            : NextResponse.next();
    }

    // Protect all other routes
    if (!isAuthenticated) {
        return NextResponse.redirect(new URL("/login", request.url));
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