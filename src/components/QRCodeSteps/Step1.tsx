import { QR_CODE_CARDS } from "@/constants/qrcodeTypes";
import { useQrCreator } from "@/contexts/createQRCodesContext";

const Step1 = () => {
    const { step } = useQrCreator();

    return (
        <div>
            <h1>{step}. Choose your QR code&apos;s type</h1>
            <div>
                <QRCodesCard />
            </div>
        </div>
    );
}

const QRCodesCard = () => {
    const { setQrType, setStep, step } = useQrCreator();

    return (
        QR_CODE_CARDS.map((type, index) => (
            <div 
                key={index} 
                className="min-w-[100px] min-h-[100px] w-[8vw] h-[8vw] bg-secondary text-sm cursor-pointer"
                onClick={() => {
                    setQrType(type.title);
                    setStep(step + 1);
                }}
            >
                <h2>{type.title}</h2>
                <p>{type.description}</p>
            </div>
        ))
    );
}

export default Step1;