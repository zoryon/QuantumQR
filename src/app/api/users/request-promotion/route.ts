import { ResponseHandler } from '@/lib/ResponseHandler';
import { verifyActiveUserSession } from '@/lib/auth-helpers';
import getPrismaClient from '@/lib/db';
import { UserRole } from '@/types';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const prisma = getPrismaClient();

    // Verify active session and get user ID
    const authCheck = await verifyActiveUserSession();
    if (authCheck instanceof NextResponse) return authCheck;
    const { userId } = authCheck;

    // Fetch user with email confirmation check
    const user = await prisma.users.findUnique({
      where: { id: userId, isEmailConfirmed: true },
    });

    if (!user) {
      return ResponseHandler.notFound('User not found');
    }

    if (user.role === UserRole.ADMIN) {
      return ResponseHandler.badRequest('You are already an admin');
    }

    // Validate request body
    const input = await request.json();
    const requestReason = input?.requestReason?.trim();

    if (!requestReason) {
      return ResponseHandler.badRequest('Request reason is required');
    }

    // Check for existing request
    const existingRequest = await prisma.promotion_requests.findUnique({
      where: { userId },
    });

    if (existingRequest) {
      return ResponseHandler.conflict('You have already sent a promotion request');
    }

    // Create new promotion request
    const newRequest = await prisma.promotion_requests.create({
      data: {
        userId,
        requestReason,
      },
    });

    return ResponseHandler.success(
      'Promotion request sent successfully',
      { requestId: newRequest.id }
    );

  } catch (error) {
    return ResponseHandler.error(error);
  }
}