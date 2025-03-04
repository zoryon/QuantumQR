import { Metadata } from "next";

export const metadata: Metadata = {
    title: "QuantumQR - Edit VCard Page",
    description: "Edit your VCard even after you have shared it with people.",
};

export default function EditVCardLayout({
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