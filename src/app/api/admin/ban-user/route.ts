import { NextResponse } from 'next/server';
import { isBanned, verifySession } from '@/lib/session';
import { cookies } from 'next/headers';
import getPrismaClient from '@/lib/db';

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const prisma = getPrismaClient();

        // Get session token from cookies and verify session
        const cookieStore = cookies();
        const sessionToken = (await cookieStore).get('session_token')?.value;
        const session = await verifySession(sessionToken);

        if (!session?.userId) {
            return NextResponse.json({
                success: false,
                message: 'Not Found',
                data: null,
            }, { status: 404 });
        }

        const userId: number = session.userId as number;
        if (await isBanned(userId)) {
            return NextResponse.json({
                success: false,
                message: 'You are currently under a ban',
                data: null,
            }, { status: 403 });
        }

        // Properly parse JSON from request body
        const input = await request.json();

        if (!input || !input.banId) {
            return NextResponse.json({
                success: false,
                message: 'Must select a user id to ban',
                data: null,
            }, { status: 400 });
        }

        // Check if user exists and is active
        const user = await prisma.active_users.findUnique({
            where: { id: Number(input.banId) },
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User doesn't exist or is already banned",
                data: null,
            }, { status: 400 });
        }

        // Insert into banned_users table
        const bannedUser = await prisma.banned_users.create({
            data: {
                userId: Number(input.banId),
                bannerAdminId: userId,
            },
        });

        if (!bannedUser) {
            return NextResponse.json({
                success: false,
                message: 'Failed to ban user',
                data: null,
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'User banned successfully',
            data: true,
        });

    } catch (e: any) {
        return NextResponse.json({
            success: false,
            message: e.message || 'Internal server error',
            data: null,
        }, { status: 500 });
    }
}
