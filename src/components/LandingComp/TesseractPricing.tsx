"use client";

import { useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { PRICING_PLANS } from "@/constants/landing";

const TesseractPricing = () => {
    const [mounted, setMounted] = useState(false);

    // Scroll Animation
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const rotateX = useTransform(scrollYProgress, [0, 1], [15, -15]);
    const rotateY = useTransform(scrollYProgress, [0, 1], [-25, 25]);

    // Waiting for component to mount to prevent hydration issues
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    
    return (
        <section ref={ref} className="py-44 relative overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-8">
                <motion.div
                    className="relative"
                    style={{
                        rotateX,
                        rotateY,
                        transformPerspective: 1000
                    }}
                >
                    <h2 className="text-5xl font-bold text-center mb-20 bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
                        QuantumQR&apos;s Pricing
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 perspective-1000">
                        {PRICING_PLANS.map((plan) => (
                            <motion.div
                                key={plan.tier}
                                className="relative h-[500px] bg-gradient-to-br rounded-3xl p-1 backdrop-blur-xl border border-white/10 hover:border-cyan-400/30 transition-all"
                                style={{
                                    background: `linear-gradient(to bottom right, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 100%)`,
                                }}
                                whileHover={{ scale: 1.05, zIndex: 1 }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-20 rounded-3xl`} />
                                <div className="relative h-full bg-gray-900/95 rounded-[1.25rem] p-8 flex flex-col">
                                    <div className="mb-6">
                                        <div className="text-2xl font-bold">{plan.tier}</div>
                                        <div className="text-4xl font-bold mt-2">
                                            ${plan.price}<span className="text-gray-400 text-lg">/quantum</span>
                                        </div>
                                    </div>

                                    <ul className="space-y-3 flex-1">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-center gap-2 text-gray-400">
                                                <i className="fa-solid fa-check text-cyan-400" /> {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <Button className="w-full mt-6 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 gap-2">
                                        <i className="fa-solid fa-tesseract" /> Enfold
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Tesseract Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(25)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            scale: [0.5, 1, 0.5],
                            opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{
                            duration: 2 + Math.random() * 3,
                            repeat: Infinity,
                        }}
                    />
                ))}
            </div>
        </section>
    );
};

export default TesseractPricing;