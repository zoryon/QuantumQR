"use client";

import FractalCard from "@/components/LandingComp/FractalCard";
import HoloInterface from "@/components/LandingComp/HoloInterface";
import LandingNavbar from "@/components/LandingComp/LandingNavbar";
import MorphingGrid from "@/components/LandingComp/MorphingGrid";
import TesseractPricing from "@/components/LandingComp/TesseractPricing";
import { Button } from "@/components/ui/button";
import { FRACTAL_FEATURES, QR_MATRIX } from "@/constants/landing";
import { motion } from "framer-motion";
import Link from "next/link";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-grid-white/[0.03] relative overflow-hidden">
            {/* Deconstructed Navigation */}
            <LandingNavbar />

            {/* Hero Section with Morphing Grid */}
            <section className="pt-44 pb-96 relative">
                <div className="mx-auto max-w-7xl px-4 sm:px-8">
                    <motion.div
                        className="flex flex-col lg:flex-row gap-16 items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2 }}
                    >
                        <div className="flex-1 space-y-8">
                            <h1 className="text-7xl font-bold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
                                <span className="block mb-4">Evolution.</span>
                                <span className="text-4xl font-medium text-gray-400">Redefining QR Codes↗</span>
                            </h1>
                            <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                                Transform static QR Codes into living digital organisms with ease & security.
                            </p>
                            <Link href="/login" className="block">
                                <Button className="h-16 px-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-[1.02] transition-transform">
                                    <i className="fa-solid fa-bolt mr-3" /> Start Generating
                                </Button>
                            </Link>
                        </div>

                        <div className="flex-1 relative">
                            <MorphingGrid matrix={QR_MATRIX} />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Fractal Feature Matrix */}
            <section className="py-44 relative">
                <div className="mx-auto max-w-7xl px-4 sm:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {FRACTAL_FEATURES.map((feature, index) => (
                            <FractalCard
                                key={feature.title}
                                index={index}
                                {...feature}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Holographic Demo Section */}
            <HoloInterface />

            {/* QuantumQR's Pricing Tesseract */}
            <TesseractPricing />
        </div>
    );
}

export default LandingPage;