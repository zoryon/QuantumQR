import { NextResponse } from 'next/server';
import { isBanned, verifySession } from '@/lib/session';
import { cookies } from 'next/headers';
import getPrismaClient from '@/lib/db';
import { UserRole, ResultType } from '@/types';

export async function GET(): Promise<NextResponse<ResultType>> {
    try {
        const prisma = getPrismaClient();

        // Retrieve session token from cookies and verify session
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

        // Check if user is banned
        if (await isBanned(userId)) {
            return NextResponse.json({
                success: false,
                message: 'You are currently under a ban',
                data: null,
            }, { status: 403 });
        }

        // Check if user is admin
        const currentUser = await prisma.users.findUnique({
            where: { id: userId, isEmailConfirmed: true },
        });

        if (!currentUser || currentUser.role !== UserRole.ADMIN) {
            return NextResponse.json({
                success: false,
                message: 'Not Found',
                data: null,
            }, { status: 404 });
        }

        // Get all users with role USER along with subscription tier and QR stats
        // Since Prisma doesn't support subqueries easily, use raw SQL query
        const users = await prisma.$queryRaw`
            SELECT u.*, t.name AS tier,
                (SELECT COUNT(*) FROM qr_codes WHERE userId = u.id) AS qrCodesCount,
                (SELECT COALESCE(SUM(scans), 0) FROM qr_codes WHERE userId = u.id) AS totalScans
            FROM active_users AS u
            JOIN subscriptions s ON u.id = s.userId
            JOIN tiers t ON s.tierId = t.id
            WHERE u.role = ${UserRole.USER}
        `;

        // Manually convert BigInt fields to string
        const serializedUsers = (users as any).map((user: any) => ({
            ...user,
            qrCodesCount: user.qrCodesCount?.toString(),
            totalScans: user.totalScans?.toString(),
            // Also check any other BigInt fields you might have
        }));

        return NextResponse.json({
            success: true,
            message: 'User list found successfully',
            data: serializedUsers,
        });
    } catch (e: any) {
        return NextResponse.json({
            success: false,
            message: e.message,
            data: null,
        }, { status: 500 });
    }
}
