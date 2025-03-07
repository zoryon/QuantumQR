import { NextResponse, type NextRequest } from "next/server";
import { verifySession } from "./lib/session";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("session_token")?.value;
    const isAuthenticated = await verifySession(token);
    const { pathname } = req.nextUrl;

    // Define public API endpoints
    const isApiRoute = pathname.startsWith("/api");
    const isPublicApiRoute = [
        "/api/auth/login",
        "/api/auth/register",
        "/api/qrcodes/find",
        "/api/qrcodes/scan",
        "/api/policies"
    ].some(route => pathname.startsWith(route));

    // Define public pages routes
    const isPublicPage = [
        "/landing", 
        "/register", 
        "/login", 
        "/policies/privacy-policy",
        "/policies/terms-of-service"
    ].includes(pathname);

    // 1. Handle API routes first
    if (isApiRoute) {
        // Allow public API routes regardless of auth
        if (isPublicApiRoute) {
            return NextResponse.next();
        }

        // Block unauthorized access to private API routes
        if (!isAuthenticated) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.next();
    }

    // 2. Handle policies pages (complete public access)
    if (isPublicPage && (pathname === "/policies/privacy-policy" || pathname === "/policies/term-of-services")) {
        return NextResponse.next();
    }

    // 3. Handle public pages
    if (isPublicPage) {
        return isAuthenticated
            ? NextResponse.redirect(new URL("/", req.url))
            : NextResponse.next();
    }

    // 4. Handle QR code pages (partial public access)
    if (pathname.startsWith("/qrcodes/") && !pathname.startsWith("/qrcodes/create")) {
        return NextResponse.next();
    }

    // 5. Redirect unauthenticated users to landing page
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