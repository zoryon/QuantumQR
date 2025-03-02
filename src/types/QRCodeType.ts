import { qrcodes, vcardqrcodes } from "@prisma/client";

export type QRCodeTypes = "vCards";

export type BaseQrCode = qrcodes & {
    type: QRCodeTypes;
};

export type VCardQRCode = vcardqrcodes & {
    type: "vCards";
}

export type QRCode = BaseQrCode & VCardQRCode;

export type VCardResponse = BaseQrCode & VCardQRCode;