import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import getPrismaClient from "@/lib/db"; 
import { verifySession, isBanned } from "@/lib/session"; 
import { QrCodeFlexible, ResultType } from "@/types"; 
import { TYPE_MAPPING } from "@/constants";

/**
 * Handles retrieving all QR codes associated with the authenticated user,
 * including type-specific data.
 *
 * - Validates the session token and checks for ban status.
 * - Dynamically builds the Prisma `include` object to fetch related QR code types.
 * - Retrieves QR codes from the database with their respective type-specific data using includes.
 * - Processes the results to determine the type of each QR code and merge the type-specific data.
 * - Returns the structured QR code data or an appropriate error response (401, 403, 500).
 *
 * @returns {Promise<NextResponse<ResultType<QrCodeData[]>>>} A JSON response containing the user's QR codes or an error message.
 */
export async function GET(): Promise<NextResponse<ResultType>> {
    try {
        // 1. Check HTTP method (Next.js handles GET by function name)

        // 2. Validate user session and check for ban status
        const sessionToken = (await cookies()).get("session_token")?.value;
        const session = await verifySession(sessionToken);

        if (!session?.userId) {
            // Unauthorized if no valid session or user ID
            return NextResponse.json({
                success: false,
                message: "You are not logged in or your session has expired",
                data: null
            }, { status: 401 });
        }

        const userId = Number(session.userId); // Ensure userId is a number

        // Check for ban status (using the isBanned function from the previous step)
        const userIsBanned = await isBanned(userId);
        if (userIsBanned) {
            return NextResponse.json({
                success: false,
                message: "You are currently under a ban",
                data: null
            }, { status: 403 }); // Forbidden
        }

        // 3. Database Interaction - Fetch QR codes with related type data
        const prisma = getPrismaClient();

        // Dynamically build the `include` object based on TYPE_MAPPING relations
        const includeRelations: { [key: string]: boolean } = {};
        TYPE_MAPPING.forEach(mapping => {
            includeRelations[mapping.relation] = true;
        });

        // Fetch QR codes for the user, including the related type-specific data
        const qrCodesWithRelations = await prisma.qr_codes.findMany({
            where: { userId: userId },
            include: includeRelations, // Include type-specific relations
            orderBy: { createdAt: 'asc' } // Optional: Add ordering if needed
        });

        // Note: prisma.findMany() returns an empty array [] if no records are found,
        // it doesn't return null like PHP's fetchAll with ?: [] might imply.
        // No need for `if (!qrCodesWithRelations)` check here, unless you expect a Prisma error.


        // 4. Process the results to structure the data per QR code type
        const processedQRCodes: QrCodeFlexible[] = qrCodesWithRelations.map(qr => {
            // Start with common QR code fields
            const entry: QrCodeFlexible = {
                id: Number(qr.id), // Explicit cast as in PHP
                userId: Number(qr.userId), // Include userId
                name: qr.name,
                url: qr.url,
                scans: Number(qr.scans), // Explicit cast as in PHP
                createdAt: qr.createdAt!,
                updatedAt: qr.updatedAt!,
                type: 'classics', // Default type
                // Other common fields from QrCode model...
            };

            // Find the specific type and merge its data if the relation is not null
            for (const mapping of TYPE_MAPPING) {
                // Access the included relation data using the relation name
                const relationData = (qr as any)[mapping.relation];

                // If the relation data exists (i.e., it was included and not null),
                // this QR code is of this type.
                if (relationData !== null && typeof relationData === 'object') {
                    entry.type = mapping.type; // Set the detected type

                    // Merge fields from the type-specific relation data
                    // Iterate over the properties of the relation data object
                    for (const key in relationData) {
                        // Ensure the key belongs to the object itself (not prototype)
                        // and is not the foreign key linking back to QrCode (e.g., 'qrCodeId')
                        if (Object.prototype.hasOwnProperty.call(relationData, key) && key !== 'qrCodeId') {
                             // Add the field from the type-specific data to the main entry
                             entry[key] = relationData[key];
                        }
                    }

                    // Once the type is found and data merged, break the inner loop
                    break;
                }
            }

            // The PHP version used array_filter to remove remaining nulls and 'qrCodeId'.
            // Our processing above selectively merges, so nulls from *non-matching* relations
            // are never added. Nulls that exist *within* the common QR or the *matching*
            // type-specific data will be included unless explicitly filtered here if needed.
            // The `QrCodeData` type allows extra properties, matching the PHP's flat structure.

            return entry; // Return the processed QR code entry
        });

        // 5. Send success response
        return NextResponse.json({
            success: true,
            message: "QR codes retrieved successfully",
            data: processedQRCodes
        }, { status: 200 });
    } catch (error) {
        console.error("API Error fetching QR codes:", error);
        // 6. Handle errors
        // In production, avoid sending detailed error messages like (error as Error).message
        return NextResponse.json({
            success: false,
            message: "Internal server error", // Generic message
            data: null
        }, { status: 500 });
    }
}