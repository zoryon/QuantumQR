import { NextResponse } from "next/server";
import getPrismaClient from "@/lib/db";
import { ResultType } from "@/types";

/**
 * Returns the list of all available subscription tiers.
 *
 * - Only accepts GET requests (handled automatically by function name).
 * - Queries the `tiers` table using Prisma.
 * - Returns the full list of tiers or an error if something goes wrong.
 *
 * @returns {Promise<NextResponse<ResultType>>}
 */
export async function GET(): Promise<NextResponse<ResultType>> {
    try {
        const prisma = getPrismaClient();

        const tiers = await prisma.tiers.findMany(); 

        return NextResponse.json({
            message: "Tiers found successfully",
            success: true,
            data: tiers,
        }, { status: 200 });
    } catch (error) {
        console.error("API Error fetching tiers:", error);
        return NextResponse.json({
            message: "Internal server error",
            success: false,
            data: null,
        }, { status: 500 });
    }
}
