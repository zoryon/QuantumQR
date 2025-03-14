import getPrismaClient from "@/lib/db";
import { verifySession } from "@/lib/session";
import { ResultType } from "@/types/ResultType";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    try {
        // if not logged-in -> block access
        const sessionToken = (await cookies()).get("session_token")?.value;
        const session = await verifySession(sessionToken);

        if (!session?.userId) {
            return NextResponse.json<ResultType>({
                success: false,
                message: "You are not logged in",
                body: null
            }, { status: 401 });
        }

        // get the id of the QR code to delete
        const { id } = await req.json();

        // delete the QR code
        const prisma = getPrismaClient();
        const deleted = await prisma.qrcodes.delete({
            where: {
                id,
                userId: session.userId,
            },
        });

        return NextResponse.json<ResultType>({
            success: true,
            message: "QR code deleted",
            body: deleted
        }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json<ResultType>({ 
            success: false, 
            message: "Internal server error",
            body: null
        }, { status: 500 });
    }

}