import { QrCreatorProvider } from "@/hooks/useQrCodeCreator";
import { QrCodeListProvider } from "@/hooks/useQrCodeList";

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