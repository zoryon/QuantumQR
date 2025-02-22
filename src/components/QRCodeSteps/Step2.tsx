"use client";

import { useQrCodeCreator } from "@/contexts/createQRCodesContext";
import VCardForm from "./QRCodeForms/VCardForm";
import { useEffect } from "react";
import { useQrCodeList } from "@/contexts/qrCodesListContext";
import { useRouter } from "next/navigation";

const Step2 = () => {
    const { step, qrType, created, reset } = useQrCodeCreator();
    const { refreshQrCodesList } = useQrCodeList();
    const router = useRouter();

    useEffect(() => {
        if (created !== true) return;
        
        reset();
        refreshQrCodesList();
        router.push("/");
    }, [created])

    return (
        <div>
            <h1>{step}. Add content to your QR code</h1>
            <div>
                {qrType === "vCard" && <VCardForm />}
            </div>
        </div>
    );
}

export default Step2;