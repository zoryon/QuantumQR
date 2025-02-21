"use client";

import { useQrCodeList } from "@/contexts/qrCodesListContext";
import { QRCode } from "@/types/QRCodeType";
import Image from "next/image";

const HomePage = () => {
  const { qrCodes } = useQrCodeList();

  return (
    <div>
      {qrCodes.length > 0 && <QRCodeList qrCodes={qrCodes} />}
    </div>
  );
}

const QRCodeList = ({ qrCodes } : { qrCodes: QRCode[] }) => {
  return (
    qrCodes.map((qrCode) => (
      <div 
        key={qrCode.id}
        className="flex gap-2 items-center"
      >
        <Image
          src={qrCode.url}
          alt={qrCode.name}
          width={2000}
          height={2000}
          className="size-[6vw]"
        />
        <p>{qrCode.name}</p>
      </div>
    ))
  );
}

export default HomePage;
