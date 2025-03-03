"use client";

import { z } from "zod";
import { cardDetailsFormSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

const VCardForm = () => {
    const { qrType, setCreated } = useQrCodeCreator();

    async function onSubmit(values: z.infer<typeof cardDetailsFormSchema>) {
        try {
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

            // const data = await res.json()
            if (await res.json()) {
                setCreated(true);
            }
        } catch (error: any) {
            console.error("Error during QR code creation:", error.message);
        }
    }

    const form = useForm<z.infer<typeof cardDetailsFormSchema>>({
        resolver: zodResolver(cardDetailsFormSchema),
        defaultValues: {
            name: "",
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            address: "",
            websiteUrl: "",
        },
    });

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
                                                placeholder="123 Business Street"
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
                                name="websiteUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-300">Website URL</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="url"
                                                placeholder="https://company.com"
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
                </div>
            </form>
        </Form>
    );
};

export default VCardForm;