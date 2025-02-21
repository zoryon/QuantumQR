import { QrCreatorProvider } from "@/contexts/createQRCodesContext";
import { QrCodeListProvider } from "@/contexts/qrCodesListContext";

const Providers = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <QrCodeListProvider>
            <QrCreatorProvider>
                {children}
            </QrCreatorProvider>
        </QrCodeListProvider>
    );
}

export default Providers;