"use client";

import { cardDetailsFormSchema, CardDetailsFormValues, classicDetailsFormSchema, ClassicDetailsFormValues, EditVCardFormValues } from "@/lib/schemas";
import { QRCodeTypes, VCardQRCode } from "@/types/QRCodeType";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form";

type VCardData = Omit<VCardQRCode, 'type' | 'qrCodeId'>;
type DesignOptions = {
    color: string;
    logo: File | null;
};
export type FormValues =
    ClassicDetailsFormValues |
    CardDetailsFormValues |
    EditVCardFormValues;

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
    handleNext: () => void,
    isPending: boolean,
    setIsPending: React.Dispatch<React.SetStateAction<boolean>>,
    form: ReturnType<typeof useForm<FormValues>>
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
    const [qrType, setQrType] = useState<QRCodeTypes>("classic");
    const [created, setCreated] = useState<boolean>(false);
    const [vCardData, setVCardData] = useState<VCardData>(initialVCardData);
    const [designOptions, setDesignOptions] = useState<DesignOptions>(initialDesignOptions);
    const [isPending, setIsPending] = useState<boolean>(false);

    const getSchemaAndDefaultValues = useCallback(() => {
        switch (qrType) {
            case "classic":
                return {
                    schema: classicDetailsFormSchema,
                    defaultValues: {
                        name: "My Professional Card",
                        websiteUrl: "https://company.com"
                    } as ClassicDetailsFormValues
                };
            case "vCards":
                return {
                    schema: cardDetailsFormSchema,
                    defaultValues: {
                        name: "My Professional Card",
                        firstName: "John",
                        lastName: "Doe",
                        email: "john@company.com",
                        phoneNumber: "+1 555 000 0000",
                        address: "123 Main St, City",
                        websiteUrl: "https://company.com"
                    } as CardDetailsFormValues
                };
            // Add more cases here for future QR types
            default:
                throw new Error(`Unsupported qrType: ${qrType}`);
        }
    }, [qrType]);

    const { schema, defaultValues } = getSchemaAndDefaultValues();

    const form = useForm<FormValues>({
        resolver: zodResolver(schema) as any,
        defaultValues: defaultValues as FormValues
    });

    useEffect(() => {
        form.reset(defaultValues);
    }, [qrType]);


    function reset() {
        setCreated(false);
        setQrType("classic");
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
            handlePrev, handleNext,
            isPending, setIsPending,
            form
        }}>
            {children}
        </QrCreatorContext.Provider>
    );
}

export function useQrCodeCreator() {
    return useContext(QrCreatorContext);
}