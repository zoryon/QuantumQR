import { ResponseHandler } from "@/lib/ResponseHandler";
import { verifyActiveUserSession } from "@/lib/auth-helpers";
import getPrismaClient from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
    try {
        // Verify active session and get user ID
        const authCheck = await verifyActiveUserSession();
        if (authCheck instanceof NextResponse) return authCheck;
        const { userId } = authCheck;

        const prisma = getPrismaClient();

        // Parallel data fetching
        const [userData, qrCodesCount, scansAggregation] = await Promise.all([
            prisma.users.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    createdAt: true,
                    updatedAt: true,
                    role: true,
                    subscriptions: {
                        select: {
                            tiers: { select: { name: true } }
                        }
                    }
                },
            }),
            prisma.qr_codes.count({ where: { userId } }),
            prisma.qr_codes.aggregate({
                _sum: { scans: true },
                where: { userId }
            })
        ]);

        if (!userData) {
            return ResponseHandler.notFound("User data not found");
        }

        // Safely handle subscription tier
        const tierName = userData.subscriptions[0]?.tiers.name || "Free";

        // Create new object without subscriptions field
        const publicUserData = {
            id: userData.id,
            email: userData.email,
            username: userData.username,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
            role: userData.role,
            tier: tierName,
            qrCodesCount,
            totalScans: scansAggregation._sum.scans ?? 0
        };

        return ResponseHandler.success(
            "User data retrieved successfully",
            publicUserData
        );

    } catch (error) {
        return ResponseHandler.error(error);
    }
}