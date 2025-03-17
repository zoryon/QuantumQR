"use server";

import { VCardResponse } from "@/types/QRCodeType";

/**
 * Updates a vCard by sending the modified data to the API.
 * 
 * - Extracts the updated vCard fields from the `formData` object.
 * - Sends a `PUT` request to update the vCard on the server.
 * - Returns a success or failure response based on the API result.
 * - Logs errors and retains previous state data if the update fails.
 * 
 * @param {any} prevState - The previous state before the update request.
 * @param {FormData} formData - The form data containing updated vCard information.
 * @returns {Promise<{ success: boolean; message: string; data: VCardResponse }>} A response object indicating success or failure.
 */
export async function updateVCard(prevState: any, formData: FormData): Promise<{ success: boolean; message: string; data: VCardResponse; }> {
    try {
        // Construct the payload object with updated vCard data
        const payload = {
            qrCodeId: Number(formData.get("qrCodeId")),
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            phoneNumber: formData.get("phoneNumber"),
            email: formData.get("email"),
            websiteUrl: formData.get("websiteUrl"),
            address: formData.get("address"),
        };

        // Send a PUT request to the API endpoint for updating the vCard
        const response = await fetch(`${process.env.WEBSITE_URL}/api/qrcodes/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Update failed");

        // Parse the response data as a VCardResponse object
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