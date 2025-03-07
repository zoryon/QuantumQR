"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { cardDetailsFormSchema } from "@/lib/schemas";
import PreviewCard from "@/components/PreviewCard";
import { zodResolver } from "@hookform/resolvers/zod";
import VCardForm from "./QRCodeSteps/QRCodeForms/VCardForm";

export default function CreateVCardEditor() {
    const form = useForm<z.infer<typeof cardDetailsFormSchema>>({
        resolver: zodResolver(cardDetailsFormSchema),
        defaultValues: {
            name: "My Professional Card",
            firstName: "John",
            lastName: "Doe",
            email: "john@company.com",
            phoneNumber: "+1 555 000 0000",
            address: "123 Main St, City",
            websiteUrl: "https://company.com",
        },
    });

    const currentData = form.watch();

    // Preview Data
    const previewData = {
        id: -1,
        name: currentData.name || "My Professional Card",
        firstName: currentData.firstName || "John",
        lastName: currentData.lastName || "Doe",
        email: currentData.email || "john@company.com",
        phoneNumber: currentData.phoneNumber || "+1 555 000 0000",
        address: currentData.address || "123 Main St, City",
        websiteUrl: currentData.websiteUrl || "https://company.com",
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Form Section */}
            <div className="space-y-6">
                <VCardForm form={form} />
            </div>

            {/* Preview Section */}
            <div className="lg:col-span-1 p-6">
                <div className="sticky top-8">
                    <PreviewCard data={previewData} />
                </div>
            </div>
        </div>
    );
}