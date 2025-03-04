import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QuantumQR - Auth Page",
  description: "Register & Access your QuantumQR account to start generating QR codes.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-screen min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 animate-gradient-rotate bg-gradient-to-r from-indigo-900/20 via-purple-900/20 to-transparent" />

      {/* Floating QR icon decoration */}
      <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl" />

      {children}
    </div>
  );
}