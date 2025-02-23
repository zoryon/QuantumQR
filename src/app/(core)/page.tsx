"use client";

import { useQrCodeList } from "@/contexts/qrCodesListContext";
import { QRCode } from "@/types/QRCodeType";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

const HomePage = () => {
  const { qrCodes, isLoading } = useQrCodeList();

  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter or transform the qrCodes if needed
  const filteredQRCodes = searchQuery
    ? qrCodes.filter((code) =>
        code.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : qrCodes;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Floating Action Button (Mobile) */}
      <Button
        className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-0 shadow-2xl shadow-indigo-500/30 transition-transform hover:scale-110 sm:hidden"
      >
        <i className="fas fa-plus text-lg" />
      </Button>

      <main className="mx-auto max-w-7xl px-4 sm:px-8 py-8">
        {/* Title / Subheading */}
        <h1 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
          My QR codes
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          Manage, download and analyze your QR Codes in a simple and modern way.
        </p>

        {/* Search bar (optional) */}
        <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row">
          {/* Search bar */}
          <div className="relative w-full max-w-sm ">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for your QRs...."
              className="block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 pr-10 text-sm text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <i className="fas fa-search absolute right-3 top-2.5 text-gray-500 text-sm" />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <QRCodeListSkeleton />
        ) : filteredQRCodes.length > 0 ? (
          <QRCodeList qrCodes={filteredQRCodes} />
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
};

// QRCodeList -> card layout for both mobile and desktop 
const QRCodeList = ({
  qrCodes,
}: {
  qrCodes: QRCode[];
}) => {
  const { setQrCodes } = useQrCodeList();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {qrCodes.map((qrCode) => {
        const createdDate = new Date(qrCode.createdAt).toLocaleDateString("it-IT", {
          dateStyle: "medium",
        });

        return (
          <article
            key={qrCode.id}
            className="flex flex-col rounded-xl border border-gray-800 bg-gray-850 p-4 shadow-md transition-all hover:shadow-lg hover:shadow-indigo-500/10"
          >
            {/* Top Row: Checkbox + "vCard"/type + Scans */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                
                {/* Example “type” label; adjust as needed */}
                <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-400">
                  vCard
                </span>
              </div>
              {/* Example scans count */}
              <span className="text-xs text-gray-500">{0} scans</span>
            </div>

            {/* Middle Row: QR image + Name + Link + Date */}
            <div className="mt-4 flex items-center gap-3">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-700 bg-gray-800">
                <Image
                  src={qrCode.url}
                  alt={qrCode.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="truncate text-sm font-semibold text-gray-100">
                  {qrCode.name}
                </h3>
                <p className="mt-1 truncate text-xs text-gray-400">
                  {qrCode.websiteUrl ?? "https://qr-code.click"}
                </p>
                <p className="mt-1 text-[11px] text-gray-500">
                  Modified: {createdDate}
                </p>
              </div>
            </div>

            {/* Bottom Row: Download + Edit/Delete */}
            <div className="mt-4 flex items-center justify-between">
              <Button
                variant="outline"
                className="rounded-md border-gray-700 text-xs font-medium text-gray-200 hover:border-indigo-500 hover:bg-gray-800 hover:text-indigo-400"
              >
                <i className="fas fa-download mr-2" />
                Download
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-md text-indigo-400/80 hover:bg-indigo-400/10 hover:text-indigo-400"
                >
                  <i className="fas fa-pen-to-square" />
                </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-md text-red-400/80 hover:bg-red-400/10 hover:text-red-400"
                    onClick={async () => {
                      setQrCodes(prev => prev.filter(code => code.id !== qrCode.id));

                      const res = await fetch("/api/qrcodes/delete", {
                        method: "DELETE",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ id: qrCode.id }),
                      });

                      if (!res.ok) {
                        alert("Failed to delete QR code.");
                      }
                    }}
                  >
                    <i className="fas fa-trash-can" />
                  </Button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

// EmptyState
const EmptyState = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
    <div className="relative mb-6">
      <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="relative animate-float">
        <i className="fas fa-qrcode text-7xl text-indigo-400/20" />
      </div>
    </div>
    <h2 className="mb-2 text-xl font-bold text-gray-100 sm:text-2xl">
      You don't have any QR codes yet
    </h2>
    <p className="mb-6 max-w-md text-sm text-gray-400/90">
      Create a new QR code to start tracking your scans and manage your links securely.
    </p>
    <Link href={"/qrcodes/create"}>
      <Button className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 hover:shadow-indigo-500/30">
        <i className="fas fa-bolt mr-2.5" />
        Create Now
      </Button>
    </Link>
  </div>
);

// Skeleton Loader
const QRCodeListSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="animate-pulse flex flex-col rounded-xl border border-gray-800 bg-gray-850 p-4"
      >
        <div className="flex items-center justify-between">
          <div className="h-4 w-16 rounded bg-gray-700" />
          <div className="h-3 w-8 rounded bg-gray-700" />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="relative h-20 w-20 flex-shrink-0 rounded-md bg-gray-700" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded bg-gray-700" />
            <div className="h-3 w-1/2 rounded bg-gray-700" />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="h-8 w-20 rounded bg-gray-700" />
          <div className="flex gap-2">
            <div className="h-8 w-8 rounded bg-gray-700" />
            <div className="h-8 w-8 rounded bg-gray-700" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default HomePage;
