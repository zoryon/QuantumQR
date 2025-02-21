"use client";

import { QRCode } from "@/types/QRCodeType";
import { createContext, useContext, useEffect, useState } from "react"

type QrCodeListContextType = {
  qrCodes: QRCode[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export const QrCodeListContext = createContext<QrCodeListContextType>(null!);

export function QrCodeListProvider({ children }: { children: React.ReactNode }) {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQrCodes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/qrcodes/find", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setQrCodes(data);
    } catch (err) {
      setError("Failed to load QR codes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQrCodes();
  }, []);

  return (
    <QrCodeListContext.Provider value={{
      qrCodes, loading, error, refresh: fetchQrCodes
    }}>
      {children}
    </QrCodeListContext.Provider>
  );
}

export function useQrCodeList() {
  return useContext(QrCodeListContext);
}