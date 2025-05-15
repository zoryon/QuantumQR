import { NextResponse } from 'next/server';
import { isBanned, verifySession } from '@/lib/session';
import { cookies } from 'next/headers';
import getPrismaClient from '@/lib/db';
import { ResultType, UserRole } from '@/types';

export async function GET(): Promise<NextResponse<ResultType>> {
    try {
        const prisma = getPrismaClient();

        // Retrieve session token from cookies and verify if the user is logged in
        const sessionToken = (await cookies()).get("session_token")?.value;
        const session = await verifySession(sessionToken);

        // If the session is invalid or no user is logged in, return a 401 Unauthorized response
        if (!session?.userId) {
            return NextResponse.json({
                success: false,
                message: "Not Found",
                data: null
            }, { status: 404 });
        }

        const userId: number = session.userId as number;
        if (await isBanned(userId)) {
            return NextResponse.json({
                success: false,
                message: "You are currently under a ban",
                data: null
            }, { status: 403 });
        }

        // Check if user is admin
        const user = await prisma.users.findUnique({
            where: { id: userId, isEmailConfirmed: true },
        });
        if (!user || user.role !== UserRole.ADMIN) {
            return NextResponse.json({
                success: false,
                message: "Not Found",
                data: null
            }, { status: 404 });
        }

        // Get stats: users count and pending reviews count
        const usersCount = await prisma.users.count();
        const pendingReviewsCount = await prisma.promotion_requests.count({
            where: { reviewedAt: null },
        });

        const result = { usersCount, pendingReviewsCount };

        return NextResponse.json({
            success: true,
            message: "Stats were calculated successfully",
            data: result
        }, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({
            success: false,
            message: e.message,
            data: null
        }, { status: 404 });
    }
}