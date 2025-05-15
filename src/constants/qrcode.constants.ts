import { cardDetailsFormSchema, classicDetailsFormSchema } from "@/lib/schemas";
import { QRCodeCard, QrTypeMapping } from "@/types/qrcode.types";
import { z } from "zod";

// String types for QR Code categories
// This array contains the types of QR codes available: "vCards" and "classics".
export const QR_CODES_TYPES_ARRAY = ["vCards", "classics"] as const;

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
    { type: 'vCards', relation: 'vcard_qr_codes' },
    { type: 'classics', relation: 'classic_qr_codes' },
];

export const UPDATE_TYPE_MAPPING = {
    vCards: {
        table: 'vcard_qr_codes',
        model: 'vcard_qr_codes',
        schema: z.object({
            name: z.string().min(1).max(255),
            firstName: z.string().min(1).max(255),
            lastName: z.string().min(1).max(255),
        })
    },
    classics: {
        table: 'classic_qr_codes',
        model: 'classic_qr_codes',
        schema: z.object({
            name: z.string().min(1).max(255),
            targetUrl: z.string().url().max(255),
        })
    }
};