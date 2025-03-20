import EditForm from "@/components/Forms/Edit/EditFormRouter";
import VCardEditor from "@/components/Editors/VCard/VCardEditor";
import { ClassicResponse, isQRCodeType, QRCodeTypes, QRCodeTypesArray, ResultType, VCardResponse } from "@/types";
import { notFound } from "next/navigation";
import { api } from "@/lib/endpointBuilder";
import { cookies } from "next/headers";

export default async function EditVCardPage({
    params: paramsPromise,
}: {
    params: Promise<{ type: string, id: string }>;
}) {
    const params = await paramsPromise;
    const { type, id } = params;
    if (!type || !id) return notFound();

    // Normalize the type before the checks
    const normalizedType = QRCodeTypesArray.find(t => t.toLowerCase() === type.toLowerCase());
    if (!normalizedType || !isQRCodeType(normalizedType)) return notFound();

    const qrCodeId = Number(id);
    if (isNaN(qrCodeId)) return notFound();

    // Retrieve the session token from cookies
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    const res: ResultType = await fetch(
        `${process.env.WEBSITE_URL}${api.qrcodes.find.query({ id: qrCodeId, type: normalizedType})}`, {
            method: "GET",
            headers: { 
                "Accept": "application/json",
                "Cookie": sessionToken ? `session_token=${sessionToken}` : "session_token="
            },
        }
    ).then((res) => res.json());
    
    if (!res || !res.success) return notFound();

    const qrCode = res.body;

    // Check if the user is the owner of the QR code
    if (!qrCode.isOwner) return notFound();

    return (
        <div className="min-h-screen bg-gray-900 overflow-hidden relative">
            {/* Dynamic Gradient Background */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute w-[1200px] h-[1200px] -top-96 -right-96 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full animate-gradient-drift" />
            </div>

            <main className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16">
                <div className="group relative rounded-[2.5rem] border border-gray-800 bg-gray-850/80 backdrop-blur-2xl shadow-2xl shadow-indigo-500/10 overflow-hidden isolate">
                    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        {RenderEditor({ type: normalizedType, qrCode })}
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
            return notFound();
    }
}