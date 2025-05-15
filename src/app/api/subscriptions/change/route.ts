import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import getPrismaClient from "@/lib/db";
import { verifySession, isBanned } from "@/lib/session";
import { ResultType } from "@/types";

export async function POST(request: Request): Promise<NextResponse<ResultType>> {
    try {
        const prisma = getPrismaClient();

        // 1. Verifica sessione utente
        const sessionToken = (await cookies()).get("session_token")?.value;
        const session = await verifySession(sessionToken);
        if (!session?.userId) {
            return NextResponse.json({
                message: "You are not logged in or your session has expired",
                success: false,
                data: null,
            }, { status: 401 });
        }

        const userId = session.userId;

        // 2. Controllo ban
        if (await isBanned(userId as number)) {
            return NextResponse.json({
                message: "You are currently under a ban",
                success: false,
                data: null,
            }, { status: 403 });
        }

        // 3. Leggi input JSON (body)
        const input = await request.json();

        if (
            !input ||
            typeof input !== "object" ||
            input.id === undefined ||
            typeof input.id !== "number"
        ) {
            return NextResponse.json({
                message: 'Invalid input. Expecting object with a numeric "id"',
                success: false,
                data: null,
            }, { status: 400 });
        }

        // 4. Recupera abbonamento attivo dell'utente
        const subscription = await prisma.subscriptions.findFirst({
            where: {
                userId,
                canceledAt: null,
            },
        });

        // 5. Controlla se l'utente ha già il tier richiesto
        if (subscription && subscription.tierId === input.id) {
            return NextResponse.json({
                message: "You already have the selected subscription tier",
                success: false,
                data: null,
            }, { status: 400 });
        }

        // 6. Controlla se il tier richiesto esiste
        const newTier = await prisma.tiers.findUnique({
            where: { id: input.id },
        });
        if (!newTier) {
            return NextResponse.json({
                message: "The selected subscription tier does not exist",
                success: false,
                data: null,
            }, { status: 404 });
        }

        // 7. Aggiorna l'abbonamento con il nuovo tier (se esiste)
        if (!subscription) {
            // Caso in cui non esiste abbonamento attivo: potresti creare un nuovo record,
            // oppure dare errore, a seconda della logica app.
            return NextResponse.json({
                message: "No active subscription found",
                success: false,
                data: null,
            }, { status: 404 });
        }

        const updatedSubscription = await prisma.subscriptions.update({
            where: { id: subscription.id },
            data: { tierId: input.id },
        });

        return NextResponse.json({
            message: "Subscription tier changed successfully",
            success: true,
            data: updatedSubscription,
        }, { status: 200 });
    } catch (error) {
        console.error("API Error updating subscription tier:", error);
        return NextResponse.json({
            message: "Internal server error",
            success: false,
            data: null,
        }, { status: 500 });
    }
}
