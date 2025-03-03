"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { editVCardFormSchema } from "@/lib/schemas";

const EditForm = ({ 
    initialData
}: { 
    initialData: z.infer<typeof editVCardFormSchema> 
}) => {
    async function onSubmit(values: z.infer<typeof editVCardFormSchema>) {
        try {
            const res = await fetch("/api/qrcodes/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            });

            if (!res.ok) throw new Error("Failed to update vCard");

            // Handle successful update
            if (await res.json()) {
                window.location.href = "/";
                window.location.reload();
            }
        } catch (error: any) {
            console.error("Update error:", error.message);
        }
    }

    const form = useForm<z.infer<typeof editVCardFormSchema>>({
        resolver: zodResolver(editVCardFormSchema),
        defaultValues: initialData || {
            id: 0,
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            websiteUrl: "",
            address: ""
        },
    });

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
                                        placeholder="+1 234 567 890"
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
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-300">Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="john@example.com"
                                        {...field}
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
                                    placeholder="https://example.com"
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
                            <FormLabel className="text-gray-300">Address</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="123 Main St, City"
                                    {...field}
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
                >
                    Update vCard
                </Button>
            </form>
        </Form>
    );
}

export default EditForm;