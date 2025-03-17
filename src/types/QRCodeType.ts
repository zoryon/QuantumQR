import { classicqrcodes, qrcodes, vcardqrcodes } from "@prisma/client";

// string types
export const QRCodeTypesArray = ["vCards", "classics"] as const;
export type QRCodeTypes = typeof QRCodeTypesArray[number];

// base object types
export type BaseQrCode = qrcodes & {
    type: QRCodeTypes;
};

export type ClassicQRCode = classicqrcodes & {
    type: "classics";
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
export function isQRCodeType(type: string): type is QRCodeTypes {
    return QRCodeTypesArray
        .map(t => t.toLowerCase())
        .includes(type.toLowerCase())
}

export function isVCardQR(code: QRCode): code is VCardResponse {
    return code.type === "vCards";
}

export function isClassicQR(code: QRCode): code is ClassicResponse {
    return code.type === "classics";
}
