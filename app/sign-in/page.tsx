"use client";

import Link from "next/link";
import { SignIn } from "@stackframe/stack";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

/**
 * Sign In page component
 * @returns 
 */
export default function SignInPage() {
    return (
        <div className="min-h-screen bg-[#0b0b0d] flex items-center justify-center relative overflow-hidden text-white">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.3, 0.2]
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-900/30 blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 12, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-[10%] -right-[10%] w-[40%] h-[60%] rounded-full bg-blue-900/20 blur-[120px]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[40px_40px]" />
            </div>

            {/* Go Back */}
            <div className="absolute top-8 left-8 z-20">
                <Link
                    href="/"
                    className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>
            </div>

            {/* Sign In Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full max-w-115 px-6"
            >
                <div className="relative z-10 w-full max-w-110 px-6">
                    <div className="bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl">
                        <div className="stack-dark-fix">
                            <style dangerouslySetInnerHTML={{
                                __html: `
              .stack-dark-fix * { color: #e4e4e7 !important; } /* zinc-300 */
              .stack-dark-fix button { color: #000000 !important; font-weight: 600; }
              .stack-dark-fix input { background: #18181b !important; border-color: #27272a !important; color: white !important; }
              .stack-dark-fix a { color: #a855f7 !important; } /* purple-500 */
              .stack-dark-fix span, .stack-dark-fix label { color: #a1a1aa !important; } /* zinc-400 */
            `}} />
                            <SignIn />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}