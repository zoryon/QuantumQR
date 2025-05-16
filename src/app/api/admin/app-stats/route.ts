import { ResponseHandler } from '@/lib/ResponseHandler';
import getPrismaClient from '@/lib/db';
import { NextResponse } from 'next/server';
import { UserRole } from '@/types';
import { verifyActiveUserSession } from '@/lib/auth-helpers';

export async function GET(): Promise<NextResponse> {
    try {
        const prisma = getPrismaClient();
        
        // Verify session and admin role
        const authCheck = await verifyActiveUserSession(UserRole.ADMIN);
        if (authCheck instanceof NextResponse) return authCheck;

        // Get stats
        const [usersCount, pendingReviewsCount] = await Promise.all([
            prisma.users.count(),
            prisma.promotion_requests.count({
                where: { reviewedAt: null },
            }),
        ]);

        return ResponseHandler.success(
            "Stats calculated successfully",
            { usersCount, pendingReviewsCount },
        );

    } catch (error) {
        return ResponseHandler.error(error);
    }
}