import { ResponseHandler } from '@/lib/ResponseHandler';
import { verifyActiveUserSession } from '@/lib/auth-helpers';
import getPrismaClient from '@/lib/db';
import { UserRole } from '@/types';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const prisma = getPrismaClient();

        // Verify session and admin role
        const authCheck = await verifyActiveUserSession(UserRole.ADMIN);
        if (authCheck instanceof NextResponse) return authCheck;
        const { userId } = authCheck;

        // Parse and validate input
        const input = await request.json();
        if (!input?.banId) {
            return ResponseHandler.badRequest('Must select a user ID to ban');
        }

        const banTargetId = Number(input.banId);
        if (isNaN(banTargetId)) {
            return ResponseHandler.badRequest('Invalid user ID format');
        }

        // Verify target user exists
        const user = await prisma.users.findUnique({
            where: { 
                id: banTargetId,
                isEmailConfirmed: true 
            },
        });

        if (!user) {
            return ResponseHandler.badRequest("User doesn't exist or isn't active");
        }

        // Create ban record
        await prisma.banned_users.create({
            data: {
                userId: banTargetId,
                bannerAdminId: userId,
            },
        });

        return ResponseHandler.success(
            true,
            'User banned successfully'
        );

    } catch (error) {
        return ResponseHandler.error(error);
    }
}