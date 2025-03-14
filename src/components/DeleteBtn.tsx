"use client";

import { useQrCodeList } from "@/contexts/qrCodesListContext";
import { Button } from "./ui/button";
import { QRCode } from "@/types/QRCodeType";
import { useState } from "react";

const DeleteBtn = ({ 
    qrCode, 
    isDisabled = false 
} : { 
    qrCode: QRCode,
    isDisabled?: boolean,
}) => {
    const [isPending, setIsPending] = useState<boolean>(false);
    const { setQrCodes, setResult } = useQrCodeList();

    return (
        <Button
            disabled={isDisabled || isPending}
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md text-red-400/80 hover:bg-red-400/10 hover:text-red-400"
            onClick={async () => {
                setIsPending(true);
                setQrCodes(prev => prev.filter(code => code.id !== qrCode.id));

                const res = await fetch("/api/qrcodes/delete", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: qrCode.id }),
                });

                if (!res.ok) {
                    setResult({ 
                        success: false,
                        message: "Failed to delete QR Code.", 
                        body: null
                    });
                } else {
                    setResult({ 
                        success: true,
                        message: "QR Code deleted successfully.", 
                        body: null
                    });
                }
                setIsPending(false);
            }}
        >
            <i className="fas fa-trash-can" />
        </Button>
    );
}

export default DeleteBtn;