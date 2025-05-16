import { ResponseHandler } from '@/lib/ResponseHandler';
import getPrismaClient from '@/lib/db';
import { NextResponse } from 'next/server';

/**
 * Retrieves all available subscription tiers.
 *
 * @returns {Promise<NextResponse>} A JSON response with the list of tiers or an error message.
 */
export async function GET(): Promise<NextResponse> {
    try {
        const prisma = getPrismaClient();

        // Fetch all subscription tiers
        const tiers = await prisma.tiers.findMany();

        return ResponseHandler.success(tiers, 'Tiers retrieved successfully');
    } catch (error) {
        return ResponseHandler.error(error);
    }
}
