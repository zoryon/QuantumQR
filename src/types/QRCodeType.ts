import { classicqrcodes, qrcodes, vcardqrcodes } from "@prisma/client";

// String types for QR Code categories
// This array contains the types of QR codes available: "vCards" and "classics".
export const QRCodeTypesArray = ["vCards", "classics"] as const;
// Define a union type `QRCodeTypes` that is derived from the elements of `QRCodeTypesArray`.
export type QRCodeTypes = typeof QRCodeTypesArray[number];

// Base object types for QR Codes
/**
 * Base structure for a QR code, including the model's fields and a `type` to classify the QR code.
 * The `type` can either be "vCards" or "classics" based on the QR code category.
 */
export type BaseQrCode = qrcodes & {
    type: QRCodeTypes;
};

/**
 * A type for Classic QR codes that extends the Prisma `classicqrcodes` model and assigns it the type "classics".
 */
export type ClassicQRCode = classicqrcodes & {
    type: "classics";
}

/**
 * A type for vCard QR codes that extends the Prisma `vcardqrcodes` model and assigns it the type "vCards".
 */
export type VCardQRCode = vcardqrcodes & {
    type: "vCards";
}

// General QRCode type, which can be either a ClassicQRCode or a VCardQRCode, both extending BaseQrCode.
export type QRCode = BaseQrCode & (ClassicQRCode | VCardQRCode);

// Responses for specific types of QR codes
/**
 * Type for a response containing a vCard QR code, which includes both `BaseQrCode` and `VCardQRCode`.
 */
export type VCardResponse = BaseQrCode & VCardQRCode;

/**
 * Type for a response containing a Classic QR code, which includes both `BaseQrCode` and `ClassicQRCode`.
 */
export type ClassicResponse = BaseQrCode & ClassicQRCode;

// Type guards for discriminating QR code types

/**
 * Type guard to check if a given string is a valid QR code type ("vCards" or "classics").
 * This helps in ensuring the string value is one of the allowed types.
 */
export function isQRCodeType(type: string): type is QRCodeTypes {
    return QRCodeTypesArray
        .map(t => t.toLowerCase()) // Convert both types and input to lowercase for case-insensitive comparison
        .includes(type.toLowerCase()) // Check if the type exists in the array
}

/**
 * Type guard to check if a QR code is of type "vCards".
 * This function helps in narrowing down the type of QR code in runtime.
 */
export function isVCardQR(code: QRCode): code is VCardResponse {
    return code.type === "vCards"; // Discriminates based on the type field
}

/**
 * Type guard to check if a QR code is of type "classics".
 * This function helps in narrowing down the type of QR code in runtime.
 */
export function isClassicQR(code: QRCode): code is ClassicResponse {
    return code.type === "classics"; // Discriminates based on the type field
}
