"use client";

import { useQrCodeList } from "@/contexts/qrCodesListContext";
import { Button } from "./ui/button";
import { QRCode } from "@/types/QRCodeType";

const DeleteBtn = ({ qrCode } : { qrCode: QRCode }) => {
    const { setQrCodes } = useQrCodeList();

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md text-red-400/80 hover:bg-red-400/10 hover:text-red-400"
            onClick={async () => {
                setQrCodes(prev => prev.filter(code => code.id !== qrCode.id));

                const res = await fetch("/api/qrcodes/delete", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: qrCode.id }),
                });

                if (!res.ok) {
                    alert("Failed to delete QR code.");
                }
            }}
        >
            <i className="fas fa-trash-can" />
        </Button>
    );
}

export default DeleteBtn;