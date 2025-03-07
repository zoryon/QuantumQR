"use server";

import EditForm from "@/components/EditForm";
import VCardEditor from "@/components/VCardEditor";
import PreviewCard from "@/components/VCardEditPreview";
import { QRCodeTypes, VCardResponse } from "@/types/QRCodeType";
import { notFound } from "next/navigation";

const type: QRCodeTypes = "vCards";

// Helper function to transform null values to undefined
const transformNullToUndefined = (data: VCardResponse) => ({
    id: data.id,
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    phoneNumber: data.phoneNumber || undefined,
    email: data.email || undefined,
    websiteUrl: data.websiteUrl || undefined,
    address: data.address || undefined,
});

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

    // Transform null values to undefined
    const transformedData = transformNullToUndefined(qrCode);

    return (
        <div className="min-h-screen bg-gray-900 overflow-hidden relative">
            {/* Dynamic Gradient Background */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute w-[1200px] h-[1200px] -top-96 -right-96 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full animate-gradient-drift" />
            </div>

            <main className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16">
                <div className="group relative rounded-[2.5rem] border border-gray-800 bg-gray-850/80 backdrop-blur-2xl shadow-2xl shadow-indigo-500/10 overflow-hidden isolate">
                    {/* Interactive Glass Effect */}
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-soft-light" />

                    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        <VCardEditor initialData={transformedData} />
                    </div>
                </div>
            </main>
        </div>
    );
}