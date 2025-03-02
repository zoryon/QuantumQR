"use server";

import { QRCodeTypes, VCardResponse } from "@/types/QRCodeType";
import { notFound } from "next/navigation";

const type: QRCodeTypes = "vCards";

export default async function EditVCardPage({
    params: paramsPromise,
}: {
    params: Promise<{ id: string }>;
}) {
    const params = await paramsPromise;
    const { id } = params;
    if (!id) return notFound();

    const qrCodeId = Number(id);
    if (isNaN(qrCodeId)) return notFound();

    const qrCode: VCardResponse = await fetch(
        `${process.env.WEBSITE_URL}/api/qrcodes/find?id=${qrCodeId}&type=${type}`, { 
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }
    ).then((res) => res.json());

    if (!qrCode) return notFound();

    return (
        <div>
            ciao
        </div>
    );
}