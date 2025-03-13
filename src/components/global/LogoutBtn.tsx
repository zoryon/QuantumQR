"use client";

import { logout } from "@/actions/authActions";
import { useState } from "react";

const LogoutBtn = () => {
    const [isPending, setIsPending] = useState(false);

    const handleLogout = async () => {
        try {
            setIsPending(true);
            await logout();
        } catch (error) {
            console.error("Logout failed: ", error);
            setIsPending(false);
        }
    };

    return (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-gray-800/90 p-2 shadow-2xl backdrop-blur-xl animate-pop-in">
            <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 transition-all
                hover:bg-red-500/20 hover:text-red-400"
                disabled={isPending}
            >
                <i className="fas fa-rocket text-xs" />
                Log Out
            </button>
        </div>
    );
}

export default LogoutBtn;