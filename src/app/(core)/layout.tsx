import Navbar from "@/components/global/Navbar";
import Providers from "@/components/Providers";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Providers>
            <Navbar />
            {children}
        </Providers>
    );
}