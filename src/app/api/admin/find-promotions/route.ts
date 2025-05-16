import { NextResponse } from 'next/server';
import getPrismaClient from '@/lib/db';
import { UserRole, ResultType } from '@/types';
import { ResponseHandler } from '@/lib/ResponseHandler';
import { verifyActiveUserSession } from '@/lib/auth-helpers';

export async function GET(): Promise<NextResponse<ResultType>> {
  try {
    const prisma = getPrismaClient();

    // Verify active session and get user ID
    const authCheck = await verifyActiveUserSession(UserRole.ADMIN);
    if (authCheck instanceof NextResponse) return authCheck;
    const { userId } = authCheck;

    if (!userId) {
      return ResponseHandler.notFound('Not Found');
    }

    // Fetch pending promotion requests
    const promotionRequests = await prisma.promotion_requests.findMany({
      where: { reviewedAt: null },
    });

    return ResponseHandler.success('Promotion requests found successfully', promotionRequests);
  } catch (error) {
    return ResponseHandler.error(error);
  }
}
