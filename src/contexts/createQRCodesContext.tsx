"use client";

import { QRCodeTypes } from "@/types/QRCode";
import { createContext, useContext, useState } from "react"

type QrCreatorContextType = {
    step: number
    setStep: (step: number) => void
    qrType: QRCodeTypes
    setQrType: (type: QRCodeTypes) => void
    vCardData: {
        firstName: string
        lastName: string
        phoneNumber: string
        email: string
        website: string
        address: string
    }
    setVCardData: (data: any) => void
    designOptions: {
        color: string
        logo: File | null
    }
    setDesignOptions: (options: any) => void
}

export const QrCreatorContext = createContext<QrCreatorContextType>(null!);

export function useQrCreator() {
    return useContext(QrCreatorContext);
}

export function QrCreatorProvider({ children }: { children: React.ReactNode }) {
    const [step, setStep] = useState<number>(1);
    const [qrType, setQrType] = useState<QRCodeTypes>("vCard");
    const [vCardData, setVCardData] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        website: "",
        address: ""
    });
    const [designOptions, setDesignOptions] = useState({
        color: "#000000",
        logo: null
    });

    return (
        <QrCreatorContext.Provider value={{
            step, setStep,
            qrType, setQrType,
            vCardData, setVCardData,
            designOptions, setDesignOptions
        }}>
            {children}
        </QrCreatorContext.Provider>
    );
}