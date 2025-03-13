"use client";

import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { editVCardFormSchema, EditVCardFormValues } from "@/lib/schemas";
import { useQrCodeList } from "@/contexts/qrCodesListContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

const EditForm = ({ form } : { form: UseFormReturn<EditVCardFormValues> }) => {
    const [isPending, setIsPending] = useState(false);
    const { qrCodes, setQrCodes } = useQrCodeList();
    const router = useRouter();

    async function onSubmit(values: z.infer<typeof editVCardFormSchema>) {
        setIsPending(true);
        // optimistic update
        const previousQrCodes = [...qrCodes];
        try {
            const updatedQrCodes = qrCodes.map(qr => 
                qr.id === values.id ? { ...qr, ...values } : qr
            );
            setQrCodes(updatedQrCodes);

            router.push("/");

            // API call to update
            const res = await fetch("/api/qrcodes/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            });

            // Handle successful update
            if (!(await res.json())) {
                setIsPending(false);
                throw new Error("Failed to update vCard")
            };
        } catch (error: any) {
            console.error("Update error:", error.message);
            setQrCodes(previousQrCodes);
            setIsPending(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-gray-800/40 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700/50">
                <div className="grid grid-cols-2 gap-4">
                    {/* Hidden ID field */}
                    <FormField
                        control={form.control}
                        name="id"
                        render={({ field }) => (
                            <FormControl>
                                <Input type="hidden" {...field} />
                            </FormControl>
                        )}
                    />

                    {/* Other forms fields */}
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-300">First Name</FormLabel>
                                <FormControl>
                                    <Input
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

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-300">Phone</FormLabel>
                                <FormControl>
                                    <Input
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
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-300">Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="john@example.com"
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

                <FormField
                    control={form.control}
                    name="websiteUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-300">Website</FormLabel>
                            <FormControl>
                                <Input
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

                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-300">Address</FormLabel>
                            <FormControl>
                                <Input
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

                <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 
                    transition-all shadow-lg shadow-indigo-500/20"
                    disabled={isPending}
                >
                    Update vCard
                </Button>
            </form>
        </Form>
    );
}

export default EditForm;