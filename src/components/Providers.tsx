import { QrCreatorProvider } from "@/contexts/createQRCodesContext";

const Providers = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <QrCreatorProvider>
            {children}
        </QrCreatorProvider>
    );
}

export default Providers;