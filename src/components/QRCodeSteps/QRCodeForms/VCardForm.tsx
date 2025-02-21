"use client";

import { z } from "zod";
import { cardDetailsFormSchema } from "@/lib/schemas";
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
import { useQrCreator } from "@/contexts/createQRCodesContext";
import { useRouter } from "next/navigation";

const VCardForm = () => {
    const { qrType } = useQrCreator();
    const router = useRouter();

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
                router.push("/");
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="min-w-[300px] w-[22vw] space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>QR Code&apos;s Name</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="your qr code&apos;s name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="your first name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="your last name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="your email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="your phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Work Address</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="your work address" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="websiteUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Website URL</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="your website&apos;s url" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />   
                <Button type="submit">Create</Button>
            </form>
        </Form>
    );
}

export default VCardForm;