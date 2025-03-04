import { NextResponse, type NextRequest } from "next/server";
import { verifySession } from "./lib/session";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("session_token")?.value;
    const isAuthenticated = await verifySession(token);
    const { pathname } = req.nextUrl;

    // Define public routes and API endpoints
    const isPublicPage = ["/landing", "/register", "/login"].includes(pathname);
    const isPublicApiRoute = [
        "/api/auth/login",
        "/api/auth/register",
        "/api/qrcodes/find",
        "/api/qrcodes/scan"
    ].some(route => pathname.startsWith(route));

    // Handle public pages
    if (isPublicPage) {
        return isAuthenticated
            ? NextResponse.redirect(new URL("/", req.url))
            : NextResponse.next();
    }

    // Handle QR codes page access (partial public access)
    if (pathname.startsWith("/qrcodes/") && !pathname.startsWith("/qrcodes/create")) {
        return NextResponse.next();
    }

    // Handle public API routes
    if (isPublicApiRoute) {
        return !isAuthenticated || pathname.endsWith("/logout")
            ? NextResponse.next()
            : NextResponse.redirect(new URL("/", req.url));
    }

    // Handle authenticated API routes
    if (pathname.startsWith("/api/")) {
        return isAuthenticated
            ? NextResponse.next()
            : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Redirect unauthenticated users to landing page
    if (!isAuthenticated) {
        return NextResponse.redirect(new URL("/landing", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};