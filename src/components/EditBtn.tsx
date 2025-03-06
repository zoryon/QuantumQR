import Link from "next/link";
import { Button } from "./ui/button";
import { QRCode } from "@/types/QRCodeType";

const EditBtn = ({ 
    qrCode,
    isDisabled = false
} : { 
    qrCode: QRCode,
    isDisabled?: boolean
}) => {
    return (
        <Link 
            href={isDisabled ? "#" : `/qrcodes/${qrCode.type.toLowerCase()}/edit/${qrCode.id}`}
            onClick={(e) => isDisabled && e.preventDefault()}
        >
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-md text-indigo-400/80 hover:bg-indigo-400/10 hover:text-indigo-400"
                disabled={isDisabled}
            >
                <i className="fas fa-pen-to-square" />
            </Button>
        </Link>
    );
}

export default EditBtn;