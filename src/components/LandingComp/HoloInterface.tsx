"use client";

import { DEMO_STATS } from "@/constants/landing";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

const HoloInterface = () => {
    return (
        <section className="py-44 relative z-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    {/* Holographic Display */}
                    <motion.div
                        className="relative h-[600px] bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-3xl backdrop-blur-2xl border border-white/10 p-8"
                        whileHover={{ rotate: -2 }}
                    >
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                        <div className="relative h-full flex flex-col">
                            <div className="flex-1 relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 blur-2xl opacity-30 group-hover:opacity-50 transition-opacity" />
                                <div className="relative h-full flex items-center justify-center">
                                    <div className="w-64 h-64 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl p-1 shadow-2xl shadow-cyan-500/20">
                                        <div className="bg-gray-900 h-full w-full rounded-2xl flex items-center justify-center">
                                            <i className="fa-solid fa-qrcode text-6xl text-cyan-400/40 animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Panel */}
                            <div className="grid grid-cols-3 gap-4 mt-8">
                                {DEMO_STATS.map((stat) => (
                                    <motion.div
                                        key={stat.metric}
                                        className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                                        whileHover={{ y: -5 }}
                                    >
                                        <div className="text-sm text-gray-400">{stat.metric}</div>
                                        <div className="text-2xl font-bold mt-2">{stat.value}</div>
                                        <div className="text-xs mt-1 text-cyan-400">{stat.change}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Interface Controls */}
                    <div className="space-y-8">
                        <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
                            Join the Future.
                        </h2>
                        <div className="text-gray-400 text-xl leading-relaxed">
                            <p>Join our new community.</p>
                            <p className="mt-2 text-lg">
                                Manipulate your QR Codes through our modern interface with real-time
                                synchronization and feedback systems.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="outline" className="h-14 px-8 rounded-full border-white/20 gap-3">
                                <i className="fa-solid fa-shield-halved" /> Our Security Polices
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HoloInterface;