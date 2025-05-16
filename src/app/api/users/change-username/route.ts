import { ResponseHandler } from '@/lib/ResponseHandler';
import { verifyActiveUserSession } from '@/lib/auth-helpers';
import getPrismaClient from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request): Promise<NextResponse> {
    try {
        // Verify active session and get user ID
        const authCheck = await verifyActiveUserSession();
        if (authCheck instanceof NextResponse) return authCheck;
        const { userId } = authCheck;

        // Validate request body
        const { username } = await req.json();
        const trimmedUsername = username?.trim();

        if (!trimmedUsername) {
            return ResponseHandler.badRequest('Username is required');
        }

        if (trimmedUsername.length > 20) {
            return ResponseHandler.badRequest('Username must be 20 characters or less');
        }

        const prisma = getPrismaClient();

        // Update username
        const result = await prisma.users.updateMany({
            where: { id: userId },
            data: { username: trimmedUsername },
        });

        if (result.count !== 1) {
            return ResponseHandler.badRequest('Failed to update username');
        }

        return ResponseHandler.success(
            null,
            'Username updated successfully'
        );
    } catch (error) {
        return ResponseHandler.error(error);
    }
}