import { isQRCodeType, QRCodeTypesArray } from "@/types";
import { notFound, redirect } from "next/navigation";

export default async function RedirectPage({
    params: paramsPromise,
}: {
    params: Promise<{ type: string, id: string }>;
}) {
    const params = await paramsPromise;
    const { type, id } = params;
    if (!type || !id) return notFound();

    const normalizedType = QRCodeTypesArray.find(t => t.toLowerCase() === type.toLowerCase());
    if (!normalizedType || !isQRCodeType(normalizedType)) return notFound();

    const qrCodeId = Number(id);
    if (isNaN(qrCodeId)) return notFound();
    
    const qrCode = await fetch(
        `${process.env.WEBSITE_URL}/api/qrcodes/find?id=${qrCodeId}&type=${normalizedType}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }
    ).then((res) => res.json());
    
    if (!qrCode) return notFound();
    if (!qrCode.websiteUrl) return notFound();

    redirect(qrCode.websiteUrl);
}
