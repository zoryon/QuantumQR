import getPrismaClient from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
        const { id } = await req.json();

        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        // Increment the scan count for the QR code
        const prisma = getPrismaClient();
        const updated = await prisma.qrcodes.update({
            where: { id },
            data: {
                scans: {
                    increment: 1
                }
            }
        });

        return NextResponse.json({ scans: updated.scans }, { status: 200 });
    } catch (error) {
        console.error("Error updating scan count: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}