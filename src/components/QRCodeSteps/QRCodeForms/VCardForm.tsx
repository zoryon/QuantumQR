"use client";

import { z } from "zod";
import { cardDetailsFormSchema, CardDetailsFormValues } from "@/lib/schemas";
import { UseFormReturn } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useQrCodeCreator } from "@/contexts/createQRCodesContext";
import { useRouter } from "next/navigation";
import { useQrCodeList } from "@/contexts/qrCodesListContext";
import { QRCode, QRCodeTypes } from "@/types/QRCodeType";

const VCardForm = ({ form } : { form: UseFormReturn<CardDetailsFormValues> }) => {
    const { qrType, setCreated } = useQrCodeCreator();
    const { qrCodes, setQrCodes } = useQrCodeList();
    const router = useRouter();

    async function onSubmit(values: z.infer<typeof cardDetailsFormSchema>) {
        // temporary ID for optimistic update
        const tempId = -Date.now();
        const previousQrCodes = [...qrCodes];

        try {
            // creating a non-accessable temporary QR Code object
            const tempQRCode: QRCode = {
                id: tempId,
                name: values.name,
                userId: tempId, 
                url: "/gif/loading.gif", 
                scans: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                type: qrType as QRCodeTypes,
                qrCodeId: tempId,
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                phoneNumber: values.phoneNumber,
                websiteUrl: values.websiteUrl || null,
                address: values.address || null
            };
    
            // optimistic update
            setQrCodes([tempQRCode, ...qrCodes]);

            router.push("/");

            // API call to create QR Code
            const res = await fetch("/api/qrcodes/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...values, qrType }),
            });

            if (!res.ok) {
                throw new Error("Failed to create QR Code");
            }

            const data = await res.json()
            if (data) {
                // sync temporary QR Code object with the newly created
                setQrCodes(prev => [
                    {
                        ...data,
                        type: qrType as QRCodeTypes,
                    },
                    ...prev.filter(qr => qr.id !== tempId)
                ]);

                setCreated(true);
            }
        } catch (error: any) {
            console.error("Error during QR code creation:", error.message);
            setQrCodes(previousQrCodes);
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                id={`${qrType.toLowerCase()}-form`}
                className="space-y-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                        <div className="form-section">
                            <h3 className="text-lg font-semibold text-gray-100 mb-4">QR Code Details</h3>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-300">QR Code Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="My Professional Card"
                                                {...field}
                                                className="bg-gray-700/20 border-gray-600/50 focus:border-indigo-400/50 focus:ring-indigo-400/50 text-gray-100"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400/80" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="form-section">
                            <h3 className="text-lg font-semibold text-gray-100 mb-4">Personal Information</h3>
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-300">First Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="John"
                                                {...field}
                                                className="bg-gray-700/20 border-gray-600/50 focus:border-indigo-400/50 focus:ring-indigo-400/50 text-gray-100"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400/80" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-300">Last Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Doe"
                                                {...field}
                                                className="bg-gray-700/20 border-gray-600/50 focus:border-indigo-400/50 focus:ring-indigo-400/50 text-gray-100"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400/80" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        <div className="form-section">
                            <h3 className="text-lg font-semibold text-gray-100 mb-4">Contact Details</h3>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-300">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="john@company.com"
                                                {...field}
                                                value={field.value || ""}
                                                className="bg-gray-700/20 border-gray-600/50 focus:border-indigo-400/50 focus:ring-indigo-400/50 text-gray-100"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400/80" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-300">Phone Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="tel"
                                                placeholder="+1 555 000 0000"
                                                {...field}
                                                value={field.value || ""}
                                                className="bg-gray-700/20 border-gray-600/50 focus:border-indigo-400/50 focus:ring-indigo-400/50 text-gray-100"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400/80" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-300">Work Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="123 Main St, City"
                                                {...field}
                                                value={field.value || ""}
                                                className="bg-gray-700/20 border-gray-600/50 focus:border-indigo-400/50 focus:ring-indigo-400/50 text-gray-100"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400/80" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="websiteUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-300">Website URL</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="url"
                                                placeholder="https://company.com"
                                                {...field}
                                                value={field.value || ""}
                                                className="bg-gray-700/20 border-gray-600/50 focus:border-indigo-400/50 focus:ring-indigo-400/50 text-gray-100"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400/80" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
};

export default VCardForm;