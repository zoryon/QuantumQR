import { QRCodeTypes } from "@/types/QRCodeType";

export const QR_CODE_CARDS: { 
    title: QRCodeTypes,
    description: string,
    icon: string,
}[] = [
    {
        title: "classic",
        description: "Share your website",
        icon: "fa-solid fa-globe-pointer",
    },
    {
        title: "vCards",
        description: "Share your virtual business card",
        icon: "fa-solid fa-address-card",
    },
    
] as const;