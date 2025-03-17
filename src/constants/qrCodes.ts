import { cardDetailsFormSchema, classicDetailsFormSchema } from "@/lib/schemas";
import { QRCodeTypes } from "@/types/QRCodeType";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

/**
 * Represents the structure of a QR code card displayed in the UI.
 * 
 * - `title`: The type of QR code.
 * - `description`: A brief explanation of what the QR code does.
 * - `icon`: A FontAwesome class representing the icon for this QR code type.
 */
type QRCodeCard = {
    title: QRCodeTypes;
    description: string;
    icon: string;
}

/**
 * Defines the mapping between QR code types, database models, and validation schemas.
 * 
 * - `type`: The category of the QR code (e.g., "classics", "vCards").
 * - `relation`: The name of the Prisma relation corresponding to this QR code type.
 * - `model`: The database model used for storing and retrieving data for this QR type.
 * - `schema`: The Zod validation schema associated with this QR code type.
 */
type QrTypeMapping = {
    type: QRCodeTypes;
    relation: keyof PrismaClient;
    model: keyof PrismaClient;
    schema: z.ZodSchema;
};

/**
 * A predefined list of QR code categories available for users.
 * 
 * Each QR code type includes:
 * - `title`: The category name.
 * - `description`: A short description of its function.
 * - `icon`: A FontAwesome icon for visual representation.
 */
export const QR_CODE_CARDS: QRCodeCard[] = [
    {
        title: "classics",
        description: "Share your website",
        icon: "fa-solid fa-globe-pointer",
    },
    {
        title: "vCards",
        description: "Share your virtual business card",
        icon: "fa-solid fa-address-card",
    },
    
] as const;

/**
 * Maps QR code types to their respective Prisma database models and validation schemas.
 * 
 * This mapping ensures proper linkage between:
 * - API request handling.
 * - Database operations (Prisma).
 * - Data validation (Zod schemas).
 */
export const TYPE_MAPPING: QrTypeMapping[] = [
    { 
        type: "vCards" as const, 
        relation: "vcardqrcodes", 
        model: "vcardqrcodes",
        schema: cardDetailsFormSchema
    },
    { 
        type: "classics" as const, 
        relation: "classicqrcodes", 
        model: "classicqrcodes",
        schema: classicDetailsFormSchema
    },
];