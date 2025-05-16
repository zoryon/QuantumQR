import { NextResponse } from "next/server";
import getPrismaClient from "@/lib/db";
import { UserRole, ResultType } from "@/types";
import { ResponseHandler } from "@/lib/ResponseHandler";
import { verifyActiveUserSession } from "@/lib/auth-helpers";

export async function POST(req: Request): Promise<NextResponse<ResultType>> {
    try {
        const prisma = getPrismaClient();

        /* ───────────────────── Session & Auth ───────────────────── */
        // Verify active session and get user ID
        const authCheck = await verifyActiveUserSession(UserRole.ADMIN);
        if (authCheck instanceof NextResponse) return authCheck;
        const { userId: adminId } = authCheck;

        if (!adminId) {
            return ResponseHandler.notFound("Not Found");
        }

        /* ───────────────────── Input Validation ─────────────────── */
        const { userId, acceptedAt, rejectedAt } = await req.json();

        if (typeof userId !== "number" || (!acceptedAt && !rejectedAt)) {
            return ResponseHandler.badRequest("Wrong data was passed");
        }

        /* ─────────────────────– Review Update ───────────────────── */
        const updateResult = await prisma.promotion_requests.updateMany({
            where: { userId },
            data: {
                reviewerAdminId: adminId,
                acceptedAt: acceptedAt ?? null,
                rejectedAt: rejectedAt ?? null,
                reviewedAt: new Date(),
            },
        });

        if (updateResult.count !== 1) {
            return ResponseHandler.badRequest("Wrong data was passed or request not found");
        }

        /* ─────────────── Promote user if accepted ──────────────── */
        if (acceptedAt) {
            const promote = await prisma.users.updateMany({
                where: { id: userId, isEmailConfirmed: true },
                data: { role: UserRole.ADMIN },
            });

            if (promote.count !== 1) {
                return ResponseHandler.error("Failed to update user role after accepting request");
            }
        }

        return ResponseHandler.success(
            "Promotion successfully reviewed",
            updateResult.count,
        );
    } catch (error) {
        return ResponseHandler.error(error);
    }
}
