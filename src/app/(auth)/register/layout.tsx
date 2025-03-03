import { Metadata } from "next";

export const metadata: Metadata = {
    title: "QuantumQR - Register Page",
    description: "Generate & Manage QR codes",
};

export default function RegisterLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {children}
        </>
    );
}