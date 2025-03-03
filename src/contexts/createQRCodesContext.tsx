"use client";

import { QRCodeTypes, VCardQRCode } from "@/types/QRCodeType";
import { createContext, useContext, useState } from "react"

type VCardData = Omit<VCardQRCode, 'type' | 'qrCodeId'>;
type DesignOptions = {
    color: string;
    logo: File | null;
};

type QrCreatorContextType = {
    step: number,
    setStep: React.Dispatch<React.SetStateAction<number>>,
    qrType: QRCodeTypes,
    setQrType: React.Dispatch<React.SetStateAction<QRCodeTypes>>,
    vCardData: VCardData,
    setVCardData: React.Dispatch<React.SetStateAction<VCardData>>,
    designOptions: DesignOptions,
    setDesignOptions: React.Dispatch<React.SetStateAction<DesignOptions>>,
    created: boolean,
    setCreated: React.Dispatch<React.SetStateAction<boolean>>,
    reset: () => void,
    handlePrev: () => void,
    handleNext: () => void
}

const initialVCardData: VCardData = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    websiteUrl: "",
    address: ""
};

const initialDesignOptions: DesignOptions = {
    color: "#000000",
    logo: null
};

export const QrCreatorContext = createContext<QrCreatorContextType>(null!);

export function QrCreatorProvider({ children }: { children: React.ReactNode }) {
    const [step, setStep] = useState<number>(1);
    const [qrType, setQrType] = useState<QRCodeTypes>("vCards");
    const [created, setCreated] = useState<boolean>(false);
    const [vCardData, setVCardData] = useState<VCardData>(initialVCardData);
    const [designOptions, setDesignOptions] = useState<DesignOptions>(initialDesignOptions);

    function reset() {
        setCreated(false);
        setQrType("vCards");
        setVCardData(initialVCardData);
        setDesignOptions(initialDesignOptions);
    }

    const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

    const handleNext = () => {
        if (step === 1 && !qrType) return null;
        setStep(prev => Math.min(prev + 1, 2));
    };

    return (
        <QrCreatorContext.Provider value={{
            step, setStep,
            qrType, setQrType,
            vCardData, setVCardData,
            designOptions, setDesignOptions,
            created, setCreated,
            reset,
            handlePrev, handleNext
        }}>
            {children}
        </QrCreatorContext.Provider>
    );
}

export function useQrCodeCreator() {
    return useContext(QrCreatorContext);
}