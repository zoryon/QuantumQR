import { NextResponse } from 'next/server';
import { isBanned, verifySession } from '@/lib/session';
import { cookies } from 'next/headers';
import getPrismaClient from '@/lib/db';
import { UserRole, ResultType } from '@/types';

export async function POST(request: Request): Promise<NextResponse<ResultType>> {
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

        const adminId: number = session.userId as number;

        if (await isBanned(adminId)) {
            return NextResponse.json({
                success: false,
                message: 'You are currently under a ban',
                data: null,
            }, { status: 403 });
        }

        // Check if admin user exists and has admin role
        const adminUser = await prisma.active_users.findUnique({
            where: { id: adminId },
        });

        if (!adminUser || adminUser.role !== UserRole.ADMIN) {
            return NextResponse.json({
                success: false,
                message: 'Not Found',
                data: null,
            }, { status: 404 });
        }

        // Parse JSON input from request body
        const input = await request.json();

        if (!input.userId) {
            return NextResponse.json({
                success: false,
                message: 'Wrong data was passed',
                data: null,
            }, { status: 400 });
        }

        // Add the admin's ID as the reviewer
        input.reviewerAdminId = adminId;

        // Update promotion_requests with review data
        const updatePromotion = await prisma.promotion_requests.updateMany({
            where: { userId: input.userId },
            data: input,
        });

        if (updatePromotion.count !== 1) {
            return NextResponse.json({
                success: false,
                message: 'Wrong data was passed or request not found',
                data: null,
            }, { status: 400 });
        }

        // If acceptedAt is set and not null, promote user to admin if email confirmed
        if (input.acceptedAt) {
            const updateUser = await prisma.users.updateMany({
                where: {
                    id: input.userId,
                    isEmailConfirmed: true,
                },
                data: { role: UserRole.ADMIN },
            });

            if (updateUser.count !== 1) {
                return NextResponse.json({
                    success: false,
                    message: 'Failed to update user role after accepting request',
                    data: null,
                }, { status: 500 });
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Promotion successfully reviewed',
            data: updatePromotion.count,
        }, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({
            success: false,
            message: e.message,
            data: null,
        }, { status: 500 });
    }
}
