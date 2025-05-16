import { ResponseHandler } from '@/lib/ResponseHandler';
import { verifyActiveUserSession } from '@/lib/auth-helpers';
import getPrismaClient from '@/lib/db';
import { NextResponse } from 'next/server';

type RequestBody = {
  id: number; // The desired subscription tier ID
};

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const prisma = getPrismaClient();

    // 1. Validate session and ban status
    const authCheck = await verifyActiveUserSession();
    if (authCheck instanceof NextResponse) return authCheck;
    const { userId } = authCheck;

    // 2. Parse and validate request body
    const body: RequestBody = await req.json();
    const tierId = body?.id;

    if (typeof tierId !== 'number') {
      return ResponseHandler.badRequest('Invalid input. Expected a numeric "id"');
    }

    // 3. Retrieve active subscription
    const subscription = await prisma.subscriptions.findFirst({
      where: {
        userId,
        canceledAt: null,
      },
    });

    if (!subscription) {
      return ResponseHandler.notFound('No active subscription found');
    }

    // 4. Check if the user already has this tier
    if (subscription.tierId === tierId) {
      return ResponseHandler.badRequest('You already have the selected subscription tier');
    }

    // 5. Check if the target tier exists
    const newTier = await prisma.tiers.findUnique({
      where: { id: tierId },
    });

    if (!newTier) {
      return ResponseHandler.notFound('The selected subscription tier does not exist');
    }

    // 6. Update the subscription to the new tier
    const updatedSubscription = await prisma.subscriptions.update({
      where: { id: subscription.id },
      data: { tierId },
    });

    return ResponseHandler.success(updatedSubscription, 'Subscription tier changed successfully');
  } catch (error) {
    return ResponseHandler.error(error);
  }
}
