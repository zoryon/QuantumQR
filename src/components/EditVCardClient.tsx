"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VCardEditor from "@/components/Editors/VCard/VCardEditor";
import EditForm from "@/components/Forms/Edit/EditFormRouter";
import { ClassicResponse, QRCodeTypes, VCardResponse } from "@/types";
import { api } from "@/lib/endpointBuilder";

const EditVCardClient = ({ type, id }: { type: QRCodeTypes, id: number }) => {
    const [qrCode, setQrCode] = useState<VCardResponse | ClassicResponse | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `${process.env.WEBSITE_URL}${api.qrcodes.find.query({ id, type })}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include"
                    }
                );  

                const result = await response.json();
                console.log(result);
                if (!result?.success || !result.body?.isOwner) {
                    router.push("/not-found");
                    return;
                }

                setQrCode(result.body);
            } catch (error) {
                router.push("/not-found");
            }
        };

        fetchData();
    }, []);

    if (!qrCode) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 overflow-hidden relative">
            <div className="absolute inset-0 opacity-40">
                <div className="absolute w-[1200px] h-[1200px] -top-96 -right-96 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full animate-gradient-drift" />
            </div>

            <main className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16">
                <div className="group relative rounded-[2.5rem] border border-gray-800 bg-gray-850/80 backdrop-blur-2xl shadow-2xl shadow-indigo-500/10 overflow-hidden isolate">
                    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        {RenderEditor({ type, qrCode })}
                    </div>
                </div>
            </main>
        </div>
    );
}

const RenderEditor = ({ type, qrCode }: { type: QRCodeTypes, qrCode: any }) => {
    switch (type) {
        case "vCards":
            return <VCardEditor id={qrCode.id} initialData={qrCode as VCardResponse} />;
        case "classics":
            return <EditForm type={type} id={qrCode.id} initialData={qrCode as ClassicResponse} />;
        default:
            return null;
    }
}

export default EditVCardClient;