"use client";

import { PublicUser } from "@/types/UserType";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
    const router = useRouter();

    const [userData, setUserData] = useState<PublicUser | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchSessionUser = async () => {
            try {
                const res = await fetch("/api/users/current");
                if (!res.ok) throw new Error("Failed to fetch user session");
                const data: PublicUser = await res.json();
                setUserData(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchSessionUser();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "GET" });
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link href={"/"} className="flex items-center space-x-3">
                        <i className="fas fa-qrcode text-2xl text-indigo-400 animate-float" />
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Quantum QR
                        </h1>
                    </Link>

                    <div className="flex items-center gap-4">
                        {userData && (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 rounded-full bg-gray-800/50 px-3 py-1.5 transition-all hover:bg-gray-700/60"
                                >
                                    <i className="fas fa-user-astronaut text-lg text-purple-400" />
                                    <span className="text-sm font-medium text-gray-200 max-w-[120px] truncate">
                                        {userData.username}
                                    </span>
                                    <i className={`fas fa-chevron-down text-xs text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-gray-800/90 p-2 shadow-2xl backdrop-blur-xl animate-pop-in">
                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 transition-all
                                            hover:bg-red-500/20 hover:text-red-400"
                                        >
                                            <i className="fas fa-rocket text-xs" />
                                            Log Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <Link href="/qrcodes/create">
                            <Button
                                className="hidden sm:flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-6 
                                py-2.5 font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] hover:shadow-indigo-500/30"
                            >
                                <i className="fas fa-plus-circle text-sm" />
                                New Code
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;