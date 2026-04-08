"use client";

import { MouseEvent } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

/**
 * FeatureCard component
 * @param param0 
 * @returns 
 */
export const FeatureCard = ({
    title,
    description,
    index,
    children
}: {
    title: string,
    description: string,
    index: number,
    children: React.ReactNode
}) => {
    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    /**
     * Handles mouse move event for hover effect
     * @param param0 
     */
    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.5,
                delay: index * 0.1
            }}
            onMouseMove={handleMouseMove}
            className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 transition-shadow"
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              350px circle at ${mouseX}px ${mouseY}px,
              rgba(168, 85, 247, 0.15),
              transparent 80%
            )
          `,
                }}
            />

            <div className="relative z-10">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-800 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                    {children}
                </div>
                <h3 className="mb-2 font-bold text-white group-hover:text-purple-200 transition-colors">{title}</h3>
                <p className="text-sm leading-6 text-zinc-400">{description}</p>
            </div>
        </motion.div>
    );
};