import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import getPrismaClient from "@/lib/db";
import { verifySession, isBanned } from "@/lib/session";
import { ResultType, UserRole } from "@/types";

export async function POST(request: Request): Promise<NextResponse<ResultType>> {
  try {
    const prisma = getPrismaClient();

    // 1. Verifica sessione
    const sessionToken = (await cookies()).get("session_token")?.value;
    const session = await verifySession(sessionToken);
    if (!session?.userId) {
      return NextResponse.json({
        message: "You are not logged in or your session has expired",
        success: false,
        data: null,
      }, { status: 401 });
    }

    const userId: number = session.userId as number;

    if (await isBanned(userId)) {
      return NextResponse.json({
        message: "You are currently under a ban",
        success: false,
        data: null,
      }, { status: 403 });
    }

    const user = await prisma.users.findUnique({
      where: { id: userId, isEmailConfirmed: true },
    });

    if (!user) {
      return NextResponse.json({
        message: "User not found",
        success: false,
        data: null,
      }, { status: 404 });
    }

    if (user.role === UserRole.ADMIN) {
      return NextResponse.json({
        message: "You are already an admin",
        success: false,
        data: null,
      }, { status: 400 });
    }

    const input = await request.json();

    if (!input?.requestReason || typeof input.requestReason !== "string" || input.requestReason.trim() === "") {
      return NextResponse.json({
        message: "Request reason is required",
        success: false,
        data: null,
      }, { status: 400 });
    }

    const trimmedReason = input.requestReason.trim();

    const existingRequest = await prisma.promotion_requests.findUnique({
      where: { userId: userId as number },
    });

    if (existingRequest) {
      return NextResponse.json({
        message: "You have already sent a promotion request",
        success: false,
        data: null,
      }, { status: 409 });
    }

    const newRequest = await prisma.promotion_requests.create({
      data: {
        userId: userId as number,
        requestReason: trimmedReason,
      },
    });

    if (!newRequest || !newRequest.id) {
      return NextResponse.json({
        message: "Failed to submit promotion request",
        success: false,
        data: null,
      }, { status: 500 });
    }

    return NextResponse.json({
      message: "Promotion request sent successfully",
      success: true,
      data: { requestId: newRequest.id },
    }, { status: 200 });
  } catch (error) {
    console.error("API Error submitting promotion request:", error);
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      data: null,
    }, { status: 500 });
  }
}
