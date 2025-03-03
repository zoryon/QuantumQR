"use client";

import { PublicUser } from "@/types/UserType";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import CreateBtn from "./CreateBtn";
import LogoutBtn from "./LogoutBtn";

const Navbar = () => {
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

    return (
        <>
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

                                    {isDropdownOpen && ( <LogoutBtn /> )}
                                </div>
                            )}

                            {/* Regular desktop button (hidden on mobile) */}
                            <div className="hidden sm:flex bottom-6 right-6 z-[60]">
                                <CreateBtn />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile floating button (outside navbar) */}
            <div className="fixed sm:hidden bottom-6 right-6 z-[60]">
                <CreateBtn />
            </div>
        </>
    );
};

export default Navbar;