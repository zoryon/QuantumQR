"use client";

import { QRCode } from "@/types/QRCodeType";
import { ResultType } from "@/types/ResultType";
import { createContext, useContext, useEffect, useState } from "react"

type QrCodeListContextType = {
  qrCodes: QRCode[],
  setQrCodes: React.Dispatch<React.SetStateAction<QRCode[]>>,
  isLoading: boolean,
  error: string | null,
  refreshQrCodesList: () => Promise<void>,
  result: ResultType,
  setResult: React.Dispatch<React.SetStateAction<ResultType>>,
};

export const QrCodeListContext = createContext<QrCodeListContextType>(null!);

export function QrCodeListProvider({ children }: { children: React.ReactNode }) {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultType>({ success: false, message: null, body: null });

  async function fetchQrCodes() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/qrcodes/findAll", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch QR codes");
      }

      const data = await res.json();

      setQrCodes(data);
    } catch (err) {
      console.log(err);
      setError("Failed to load QR codes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQrCodes();
  }, []);

  return (
    <QrCodeListContext.Provider value={{
      qrCodes, 
      setQrCodes, 
      isLoading, 
      error, 
      refreshQrCodesList: fetchQrCodes,
      result, setResult,
    }}>
      {children}
    </QrCodeListContext.Provider>
  );
}

export function useQrCodeList() {
  return useContext(QrCodeListContext);
}