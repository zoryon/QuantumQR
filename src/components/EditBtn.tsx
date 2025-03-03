import Link from "next/link";
import { Button } from "./ui/button";
import { QRCode } from "@/types/QRCodeType";

const EditBtn = ({ qrCode } : { qrCode: QRCode }) => {
    return (
        <Link href={`/qrcodes/${qrCode.type.toLowerCase()}/edit/${qrCode.id}`}>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-md text-indigo-400/80 hover:bg-indigo-400/10 hover:text-indigo-400"
            >
                <i className="fas fa-pen-to-square" />
            </Button>
        </Link>
    );
}

export default EditBtn;