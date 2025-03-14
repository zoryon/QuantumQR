import { NextResponse, type NextRequest } from "next/server";
import { verifySession } from "./lib/session";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("session_token")?.value;
    const isAuthenticated = await verifySession(token);
    const { pathname } = req.nextUrl;

    // API route handling
    if (pathname.startsWith("/api")) {
        const unauthenticatedOnlyApi = [
            "/api/auth/login",
            "/api/auth/register",
            "/api/auth/register/confirm",
            "/api/auth/forgotPassword/sendEmail",
            "/api/auth/forgotPassword/reset",
        ];

        const alwaysPublicApi = [
            "/api/qrcodes/find",
            "/api/qrcodes/scan",
            "/api/policies",
        ];

        // check for logged-in users on unauthenticated API routes
        const isUnauthenticatedApi = unauthenticatedOnlyApi.some(route => 
            pathname.startsWith(route)
        );

        if (isUnauthenticatedApi) {
            return isAuthenticated 
                ? NextResponse.json({ error: "Already authenticated" }, { status: 403 })
                : NextResponse.next();
        }

        // always allow public API routes
        const isPublicApi = alwaysPublicApi.some(route => 
            pathname.startsWith(route)
        );

        if (isPublicApi) return NextResponse.next();

        // Check for authentication on private API routes
        if (!isAuthenticated) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        return NextResponse.next();
    }

    // Public page configuration
    const alwaysPublicPages = [
        "/policies/privacy-policy",
        "/policies/terms-of-service",
    ];

    const unauthenticatedOnlyPages = [
        "/landing",
        "/login",
        "/register",
        "/register/confirm",
        "/forgot-password",
    ];

    // Always Accessible pages
    if (alwaysPublicPages.includes(pathname)) {
        return NextResponse.next();
    }

    // Redirect logged-in users from auth related pages
    if (unauthenticatedOnlyPages.includes(pathname)) {
        return isAuthenticated 
            ? NextResponse.redirect(new URL("/", req.url))
            : NextResponse.next();
    }

    // Public QR Code pages (except create)
    if (pathname.startsWith("/qrcodes/") && !pathname.startsWith("/qrcodes/create")) {
        return NextResponse.next();
    }

    // Authentication check for private pages
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