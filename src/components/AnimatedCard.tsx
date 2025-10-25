"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedCardProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export default function AnimatedCard({ children, className = "", delay = 0 }: AnimatedCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
                duration: 0.5, 
                delay,
                ease: "easeOut"
            }}
            whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
