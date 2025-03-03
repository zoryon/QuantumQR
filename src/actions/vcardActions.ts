"use server";

import { VCardResponse } from "@/types/QRCodeType";

export async function updateVCard(prevState: any, formData: FormData) {
    try {
        const payload = {
            qrCodeId: Number(formData.get("qrCodeId")),
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            phoneNumber: formData.get("phoneNumber"),
            email: formData.get("email"),
            websiteUrl: formData.get("websiteUrl"),
            address: formData.get("address"),
        };

        const response = await fetch(`${process.env.WEBSITE_URL}/api/qrcodes/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Update failed");

        const data: VCardResponse = await response.json();

        return {
            success: true,
            message: "vCard updated successfully!",
            data
        };
    } catch (error) {
        console.error("Update error:", error);
        return {
            success: false,
            message: "Failed to update vCard. Please try again.",
            data: prevState.data
        };
    }
}