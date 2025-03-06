"use client";

import { loginFormSchema } from "@/lib/schemas";
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
import { useRouter } from "next/navigation";

const LoginForm = () => {
    const router = useRouter();

    async function onSubmit(values: z.infer<typeof loginFormSchema>) {
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            });

            if (!res.ok) {
                throw new Error("Failed to login");
            }

            // const data = await res.json()
            if (await res.json()) {
                router.push("/");
                router.refresh();
            }
        } catch (error: any) {
            console.error("Error during login:", error.message);
        }
    }

    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            emailOrUsername: "",
            password: ""
        },
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-gray-800/40 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700/50">
                {/* Form fields */}
                <FormField
                    control={form.control}
                    name="emailOrUsername"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-300">Email or Username</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="your email or username"
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
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-300">Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="your password"
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
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-500/20"
                >
                    Sign In
                </Button>
            </form>
        </Form>
    );
}

export default LoginForm;