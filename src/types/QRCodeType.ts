import { classicqrcodes, qrcodes, vcardqrcodes } from "@prisma/client";

// string types
export type QRCodeTypes = "vCards" | "classic";

// base object types
export type BaseQrCode = qrcodes & {
    type: QRCodeTypes;
};

export type ClassicQRCode = classicqrcodes & {
    type: "classic";
}

export type VCardQRCode = vcardqrcodes & {
    type: "vCards";
}

// general type
export type QRCode = BaseQrCode & (ClassicQRCode | VCardQRCode);

// responses
export type VCardResponse = BaseQrCode & VCardQRCode;
export type ClassicResponse = BaseQrCode & ClassicQRCode;

// Type guards for discrimination
export function isVCardQR(code: QRCode): code is VCardResponse {
    return code.type === "vCards";
}

export function isClassicQR(code: QRCode): code is ClassicResponse {
    return code.type === "classic";
}
