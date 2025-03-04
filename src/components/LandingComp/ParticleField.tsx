"use client";

import { motion } from "framer-motion";

const ParticleField = ({ count }: { count: number }) => {
    return (
        <div className="absolute inset-0 pointer-events-none">
            {[...Array(count)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    initial={{
                        opacity: 0,
                        x: Math.random() * 2000,
                        y: Math.random() * 2000,
                    }}
                    animate={{
                        opacity: [0, 0.3, 0],
                        scale: [1, 2, 1],
                    }}
                    transition={{
                        duration: 2 + Math.random() * 5,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                    }}
                />
            ))}
        </div>
    );
}

export default ParticleField;