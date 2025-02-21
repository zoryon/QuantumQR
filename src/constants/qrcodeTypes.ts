import { QRCodeTypes } from "@/types/QRCodeType";

export const QR_CODE_CARDS: { 
    title: QRCodeTypes,
    description: string 
}[] = [
    {
        title: "vCard",
        description: "Share your virtual business card"
    },
] as const;