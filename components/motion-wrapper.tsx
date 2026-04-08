"use client";

import { motion } from "framer-motion";

/**
 * FadeIn motion wrapper component
 * @param param0 
 * @returns 
 */
export const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
    >
        {children}
    </motion.div>
);

/**
 * FloatingPreview motion wrapper component
 * @param param0 
 * @returns 
 */
export const FloatingPreview = ({ children }: { children: React.ReactNode }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
    >
        {children}
    </motion.div>
);