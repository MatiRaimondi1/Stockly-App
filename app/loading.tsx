"use client";

import { motion } from "framer-motion";

/**
 * Loading component
 * @returns 
 */
export default function Loading() {
    return (
        <div className="min-h-screen bg-[#0b0b0d] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 bg-purple-600/10 blur-[100px] rounded-full" />
            </div>

            {/* Spinner */}
            <div className="relative z-10 flex flex-col items-center">
                <div className="relative h-16 w-16">
                    <div className="absolute inset-0 rounded-full border-2 border-zinc-800" />
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}