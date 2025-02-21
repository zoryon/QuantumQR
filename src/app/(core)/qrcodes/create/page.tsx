"use client";

import Step1 from "@/components/QRCodeSteps/Step1";
import Step2 from "@/components/QRCodeSteps/Step2";
import { useQrCreator } from "@/contexts/createQRCodesContext";

const CreatePage = () => {
    const { step } = useQrCreator();

    return (
        <div>
            {step === 1 && <Step1 />}
            {step === 2 && <Step2 />}
        </div>
    );
}

export default CreatePage;