"use client";

import { motion, useMotionTemplate, useMotionValue, animate } from "framer-motion";
import { useEffect } from "react";

const InfiniteOrb = () => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const scale = useMotionValue(1);
    const background = useMotionTemplate`radial-gradient(40% 40% at ${x}px ${y}px, rgba(138,43,226,0.2) 0%, transparent 100%)`;

    useEffect(() => {
        const moveOrb = (e: MouseEvent) => {
            animate(x, e.clientX, { duration: 0.8 });
            animate(y, e.clientY, { duration: 0.8 });
        };

        window.addEventListener("mousemove", moveOrb);
        return () => window.removeEventListener("mousemove", moveOrb);
    }, []);

    return (
        <motion.div
            className="fixed inset-0 pointer-events-none z-0"
            style={{ background }}
        >
            <motion.div
                className="w-24 h-24 rounded-full absolute bg-gradient-to-br from-purple-500 to-blue-500 blur-3xl opacity-30"
                style={{ x, y, scale }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
            />
        </motion.div>
    );
};

export default InfiniteOrb;