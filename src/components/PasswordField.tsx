import { useState } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import Link from "next/link";

const PasswordField = ({ control, isLogin = false }: { control: any, isLogin?: boolean }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormField
            control={control}
            name="password"
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-gray-300 flex justify-between items-center">
                        <p>Password</p>

                        {isLogin && (
                            <Link 
                                href="/forgot-password" 
                                className="text-indigo-400 hover:text-indigo-300 transition-colors text-xs text-center"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </FormLabel>
                    <FormControl>
                        <div className="relative h-full w-full">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="your password"
                                {...field}
                                className="bg-gray-700/20 border-gray-600/50 focus:border-indigo-400/50 focus:ring-indigo-400/50 text-gray-100"
                            />

                            {/* eye icon */}
                            {showPassword ? (
                                <i
                                    className="fa-solid fa-eye-slash absolute right-5 top-1/2 -translate-y-[50%] text-sm text-gray-400 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            ) : (
                                <i
                                    className="fa-solid fa-eye absolute right-5 top-1/2 -translate-y-[50%] text-sm text-gray-400 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            )}
                        </div>
                    </FormControl>
                    <FormMessage className="text-red-400/80" />
                </FormItem>
            )}
        />
    );
}

export default PasswordField;