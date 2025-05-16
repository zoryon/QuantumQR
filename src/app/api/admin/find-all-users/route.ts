import { NextResponse } from 'next/server';
import getPrismaClient from '@/lib/db';
import { UserRole } from '@/types';
import { ResponseHandler } from '@/lib/ResponseHandler';
import { ResultType } from '@/types';
import { verifyActiveUserSession } from '@/lib/auth-helpers';

export async function GET(): Promise<NextResponse<ResultType>> {
    try {
        const prisma = getPrismaClient();

        // Verify active session and get user ID
        const authCheck = await verifyActiveUserSession(UserRole.ADMIN);
        if (authCheck instanceof NextResponse) return authCheck;
        const { userId } = authCheck;

        if (!userId) {
            return ResponseHandler.notFound("Not Found");
        }

        // Raw SQL query to get users with subscription info and QR stats
        const users = await prisma.$queryRaw`
            SELECT u.*, t.name AS tier,
                (SELECT COUNT(*) FROM qr_codes WHERE userId = u.id) AS qrCodesCount,
                (SELECT COALESCE(SUM(scans), 0) FROM qr_codes WHERE userId = u.id) AS totalScans
            FROM active_users AS u
            JOIN subscriptions s ON u.id = s.userId
            JOIN tiers t ON s.tierId = t.id
            WHERE u.role = ${UserRole.USER}
        `;

        // Convert BigInt fields to string
        const serializedUsers = (users as any).map((user: any) => ({
            ...user,
            qrCodesCount: user.qrCodesCount?.toString(),
            totalScans: user.totalScans?.toString(),
        }));

        return ResponseHandler.success(serializedUsers, "User list found successfully");
    } catch (error) {
        return ResponseHandler.error(error);
    }
}
