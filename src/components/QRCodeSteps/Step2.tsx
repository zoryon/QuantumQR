"use client";

import { useQrCreator } from "@/contexts/createQRCodesContext";
import VCardForm from "./QRCodeForms/VCardForm";

const Step2 = () => {
    const { step, qrType } = useQrCreator();
    
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