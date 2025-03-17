import { cardDetailsFormSchema, classicDetailsFormSchema } from "@/lib/schemas";
import { QRCodeTypes } from "@/types/QRCodeType";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

type QRCodeCard = {
    title: QRCodeTypes;
    description: string;
    icon: string;
}

type QrTypeMapping = {
    type: QRCodeTypes;
    relation: keyof PrismaClient;
    model: keyof PrismaClient;
    schema: z.ZodSchema;
};

// QR code types for the cards
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

// API mapping for the QR code types
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