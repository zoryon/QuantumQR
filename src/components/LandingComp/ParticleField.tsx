"use client";

import { motion } from "framer-motion";

const ParticleField = ({ count }: { count: number }) => {
    return (
        <div className="absolute inset-0 pointer-events-none">
            {[...Array(count)].map((_, i) => (
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
    );
}

export default ParticleField;