import { NextResponse } from 'next/server';
import { isBanned, verifySession } from '@/lib/session';
import { cookies } from 'next/headers';
import getPrismaClient from '@/lib/db';
import { UserRole, ResultType } from '@/types';

export async function GET(): Promise<NextResponse<ResultType>> {
    try {
        const prisma = getPrismaClient();

        // Retrieve session token from cookies and verify if the user is logged in
        const sessionToken = (await cookies()).get('session_token')?.value;
        const session = await verifySession(sessionToken);

        if (!session?.userId) {
            return NextResponse.json({
                success: false,
                message: 'Not Found',
                data: null,
            }, { status: 404 });
        }

        const userId: number = session.userId as number;

        if (await isBanned(userId)) {
            return NextResponse.json({
                success: false,
                message: 'You are currently under a ban',
                data: null,
            }, { status: 403 });
        }

        // Check if user exists and is admin
        const user = await prisma.active_users.findUnique({
            where: { id: userId },
        });

        if (!user || user.role !== UserRole.ADMIN) {
            return NextResponse.json({
                success: false,
                message: 'User not found or not authorized',
                data: null,
            }, { status: 404 });
        }

        // Fetch promotion requests where reviewedAt is null (pending reviews)
        const promotionRequests = await prisma.promotion_requests.findMany({
            where: { reviewedAt: null },
        });

        if (promotionRequests === null) {
            return NextResponse.json({
                success: false,
                message: 'Internal Server Error',
                data: null,
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Promotion requests found successfully',
            data: promotionRequests,
        }, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({
            success: false,
            message: e.message,
            data: null,
        }, { status: 500 });
    }
}
