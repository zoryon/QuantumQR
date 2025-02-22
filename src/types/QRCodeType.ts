export type QRCodeTypes = "vCard";

export type BaseQrCode = {
    id: number;
    name: string;
    userId: number;
    url: string;
    createdAt: string;
    updatedAt: string;
    type: string;
};

export type VCardQRCode = {
    type: 'vCard';
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    email?: string;
    websiteUrl?: string;
    address?: string;
    qrCodeId?: number;
};

export type QRCode = BaseQrCode & VCardQRCode;