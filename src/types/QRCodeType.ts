export type QRCodeTypes = "vCard";

export type BaseQrCode = {
    id: number;
    name: string;
    userId: number;
    url: string;
    scans: number;
    createdAt: Date | null;
    updatedAt: Date | null;
    type: QRCodeTypes;
};

export type VCardQRCode = {
    type: "vCard";
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
    email: string | null;
    websiteUrl: string | null;
    address: string | null;
    qrCodeId: number;
};

export type QRCode = BaseQrCode & VCardQRCode;

export type VCardResponse = BaseQrCode & VCardQRCode;