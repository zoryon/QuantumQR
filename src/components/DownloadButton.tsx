import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const DownloadButton = ({
    url,
    firstName,
    lastName,
    icon,
    isShadBtn = false,
    isDisabled = false,
    className
}: {
    url: string,
    firstName: string,
    lastName: string,
    icon: string,
    isShadBtn?: boolean,
    isDisabled?: boolean,
    className: string
}) => {
    return (
        isShadBtn ? (
            <a
                href={url}
                download={isDisabled ? "#" : `${firstName}_${lastName}_vCard.svg`.trim() || "qrcode.svg"}
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