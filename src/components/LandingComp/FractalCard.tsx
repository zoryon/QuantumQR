"use client";

import { motion } from "framer-motion";
import { Card } from "../ui/card";

const FractalCard = ({ symbol, title, description, index }: { symbol: string; title: string; description: string; index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: index * 0.15 }}
        >
            <Card className="bg-black/50 backdrop-blur-xl border-white/10 hover:border-cyan-400/30 transition-all h-96 flex flex-col justify-between overflow-hidden">
                <div className="p-8">
                    <div className="text-6xl mb-6 font-medium">{symbol}</div>
                    <h3 className="text-2xl font-bold mb-3">{title}</h3>
                    <p className="text-gray-400">{description}</p>
                </div>
                <div className="bg-gradient-to-r from-cyan-500/30 to-purple-500/30 h-1 w-full" />
            </Card>
        </motion.div>
    );
}

export default FractalCard;