export type QRCodeTypes = "vCard";

export type QRCodeBase = {
    id: number;
    name: string;
    userId: number;
    url: string;
    createdAt: string;
    updatedAt: string;
    type: string;
};

export type VCardQRCode = QRCodeBase & {
    type: 'vCard';
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    email?: string;
    websiteUrl?: string;
    address?: string;
};

export type QRCode = VCardQRCode;