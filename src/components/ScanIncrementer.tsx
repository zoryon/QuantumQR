"use client";

import { useEffect } from "react";

export default function ScanIncrementer({ qrCodeId }: { qrCodeId: number }) {
    useEffect(() => {
        fetch(`/api/qrcodes/scan`, { 
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: qrCodeId })
        })
            .then((res) => {
                if (!res.ok) console.error("Failed to increment scan count");
            })
            .catch((err) => console.error("Scan increment error:", err));
    }, [qrCodeId]);

    return null;
}