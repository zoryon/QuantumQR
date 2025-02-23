import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const DownloadButton = ({
    url,
    firstName,
    lastName,
    icon,
    isShadBtn = false,
    className
}: {
    url: string,
    firstName: string,
    lastName: string,
    icon: string,
    isShadBtn?: boolean,
    className: string
}) => {
    return (
        isShadBtn ? (
            <Button variant={"outline"}>
                <a
                    href={url}
                    download={`${firstName}_${lastName}_vCard.png`.trim() || "qrcode.png"}
                    className={cn(className)}
                >
                    <i className={cn(icon)} />
                    Download
                </a>
            </Button>
        ) : (
            <a
                href={url}
                download={`${firstName}_${lastName}_vCard.png`.trim() || "qrcode.png"}
                className={cn(className)}
            >
                <i className={cn(icon)} />
                Download
            </a>
        )
    );
}

export default DownloadButton;