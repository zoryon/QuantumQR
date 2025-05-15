"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { QRCodeTypes } from "@/types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { FILE_FORMATS } from "@/constants";

const DownloadButton = ({
    url,
    type,
    firstName,
    lastName,
    icon,
    isShadBtn = false,
    isDisabled = false,
    className
}: {
    url: string;
    type: QRCodeTypes;
    firstName: string | undefined;
    lastName: string | undefined;
    icon: string;
    isShadBtn?: boolean;
    isDisabled?: boolean;
    className: string;
}) => {
    const [isConverting, setIsConverting] = useState<boolean>(false);

    const handleDownload = async (format: "svg" | "png" | "jpg" | "jpeg") => {
    if (isDisabled) return;

    const fileNameBase = (!firstName || !lastName)
        ? type
        : `${firstName}_${lastName}_vCard`;

    try {
        setIsConverting(true);

        if (format === "svg") {
            // Per i data URL, dobbiamo decodificare e creare un Blob da base64
            const base64 = url.split(',')[1];
            const byteChars = atob(base64);
            const byteNumbers = new Array(byteChars.length).fill(0).map((_, i) => byteChars.charCodeAt(i));
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/svg+xml' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${fileNameBase}.svg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } else {
            const img = new Image();
            img.crossOrigin = "anonymous"; // Provare ad evitare CORS error
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;

                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                ctx.drawImage(img, 0, 0);

                const mimeType = format === "png"
                    ? "image/png"
                    : "image/jpeg";

                canvas.toBlob((blob) => {
                    if (!blob) return;

                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = `${fileNameBase}.${format}`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(link.href);
                }, mimeType);
            };
            img.onerror = () => {
                console.error("Failed to load image");
            };
            img.src = url;
        }
    } catch (error) {
        console.error("Download failed:", error);
    } finally {
        setIsConverting(false);
    }
};


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {isShadBtn ? (
                    <Button variant={"outline"} disabled={isDisabled || isConverting}>
                        <div className={cn(className)}>
                            <i className={cn(icon)} />
                            {isConverting ? "Converting..." : "Download"}
                        </div>
                    </Button>
                ) : (
                    <button className={cn(className)} disabled={isDisabled || isConverting}>
                        <i className={cn(icon)} />
                        {isConverting ? "Converting..." : "Download"}
                    </button>
                )}
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                {FILE_FORMATS.map((format) => (
                    <DropdownMenuItem
                        key={format}
                        onSelect={() => handleDownload(format as any)}
                        disabled={isConverting}
                    >
                        {format.toUpperCase()}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default DownloadButton;