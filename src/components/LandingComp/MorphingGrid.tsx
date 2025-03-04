"use client";

import { QRMatrixItem } from "@/types/landingType";
import { motion, useScroll, useTransform } from "framer-motion";

const MorphingGrid = ({ matrix }: { matrix: QRMatrixItem[] }) => {
    const { scrollYProgress } = useScroll();
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

    return (
        <motion.div
            className="relative w-[600px] h-[600px]"
            style={{ rotate }}
        >
            {matrix.map((item, index) => (
                <motion.div
                    key={item.id}
                    className={`absolute bg-gradient-to-br ${item.color} rounded-2xl p-1 backdrop-blur-xl`}
                    style={{
                        width: `${100 - index * 15}%`,
                        height: `${100 - index * 15}%`,
                        top: `${index * 7}%`,
                        left: `${index * 7}%`,
                    }}
                    animate={{
                        borderRadius: ["30%", "50%", "40%", "30%"],
                    }}
                    transition={{
                        duration: 10 + index * 2,
                        repeat: Infinity,
                    }}
                >
                    <div className="bg-gray-900 h-full w-full rounded-[inherit] flex items-center justify-center">
                        <i className={`fa-solid ${item.icon} text-4xl bg-gradient-to-br ${item.color} bg-clip-text text-transparent`} />
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default MorphingGrid;