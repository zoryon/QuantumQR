import { NextResponse } from "next/server";
import getPrismaClient from "@/lib/db";
import { UPDATE_TYPE_MAPPING } from "@/constants";
import { ResultType, PrismaModel } from "@/types";
import { ResponseHandler } from "@/lib/ResponseHandler";
import { verifyActiveUserSession } from "@/lib/auth-helpers";

export async function PUT(request: Request): Promise<NextResponse<ResultType>> {
    try {
        // Verify active session and get user ID
        const authCheck = await verifyActiveUserSession();
        if (authCheck instanceof NextResponse) return authCheck;
        const { userId } = authCheck;

        if (!userId) return ResponseHandler.unauthorized();

        const body = await request.json();
        const { id, type, ...values } = body;

        if (!id || !type) {
            return ResponseHandler.badRequest("Missing ID or type");
        }

        const mapping = UPDATE_TYPE_MAPPING[type as keyof typeof UPDATE_TYPE_MAPPING];
        if (!mapping) {
            return ResponseHandler.badRequest("Invalid QR code type");
        }

        let validatedData;
        try {
            validatedData = mapping.schema.parse(values);
        } catch (validationError: any) {
            return ResponseHandler.badRequest("Validation failed", validationError.errors);
        }

        const { name, ...typeSpecificFields } = validatedData;
        const trimmedName = typeof name === "string" ? name.trim() : name;

        const prisma = getPrismaClient();

        // Check duplicate name for the user excluding current QR code
        const duplicate = await prisma.qr_codes.findFirst({
            where: {
                userId,
                name: trimmedName,
                NOT: { id: Number(id) }
            }
        });

        if (duplicate) {
            return ResponseHandler.badRequest("QR code name already exists");
        }

        // Perform transactional update: base QR code + type-specific data
        const result = await prisma.$transaction([
            prisma.qr_codes.update({
                where: { id: Number(id), userId },
                data: { name: trimmedName, updatedAt: new Date() }
            }),
            (prisma[mapping.model as PrismaModel] as any).update({
                where: { qrCodeId: Number(id) },
                data: typeSpecificFields
            })
        ]);

        return ResponseHandler.success("QR code updated successfully", result);
    } catch (error) {
        console.error("Update failed:", error);
        return ResponseHandler.error(error);
    }
}
