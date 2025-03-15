"use client";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { QRCodeTypes } from "@/types/QRCodeType";

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
    url: string,
    type: QRCodeTypes,
    firstName: string | undefined,
    lastName: string | undefined,
    icon: string,
    isShadBtn?: boolean,
    isDisabled?: boolean,
    className: string
}) => {
    const fileName = (!firstName || !lastName) 
        ? `${type}.svg`.trim()
        : `${firstName}_${lastName}_vCard.svg`.trim();

    return (
        isShadBtn ? (
            <a
                href={url}
                download={isDisabled ? "#" : fileName}
                onClick={(e) => isDisabled && e.preventDefault()}
            >
                <Button variant={"outline"} disabled={isDisabled}>
                    <div className={cn(className)}>
                        <i className={cn(icon)} />
                        Download
                    </div>
                </Button>
            </a>
        ) : (
            <a
                href={url}
                download={isDisabled ? "#" : `${firstName}_${lastName}_vCard.svg`.trim() || "qrcode.svg"}
                onClick={(e) => isDisabled && e.preventDefault()}
                className={cn(className)}
            >
                <i className={cn(icon)} />
                Download
            </a>
        )
    );
}

export default DownloadButton;