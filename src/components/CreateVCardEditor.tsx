"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { cardDetailsFormSchema } from "@/lib/schemas";
import PreviewCard from "@/components/PreviewCard";
import { zodResolver } from "@hookform/resolvers/zod";
import VCardForm from "./QRCodeSteps/QRCodeForms/VCardForm";

// This component is used to create the vCards data
// It contains two sections:
// 1. Form Section: This section contains the form to create the vCard data
// 2. Preview Section: This section contains the live preview of the vCard data
// The form data is passed to the PreviewCard component to display the live preview
// The form data is validated using the cardDetailsFormSchema schema
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-0 xl:p-4">
            {/* Form Section */}
            <div className="space-y-6">
                <VCardForm form={form} />
            </div>

            {/* Preview Section */}
            <div className="lg:col-span-1 p-0 lg:p-6">
                <div className="sticky top-8">
                    <PreviewCard data={previewData} />
                </div>
            </div>
        </div>
    );
}