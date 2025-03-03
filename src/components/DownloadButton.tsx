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
            <a
                href={url}
                download={`${firstName}_${lastName}_vCard.png`.trim() || "qrcode.png"}
            >
                <Button variant={"outline"}>
                    <div className={cn(className)}>
                        <i className={cn(icon)} />
                        Download
                    </div>
                </Button>
            </a>
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