import Link from "next/link";
import Preview from "@/components/preview";
import { stackServerApp } from "@/stack/server";

export default async function Home() {
    const user = await stackServerApp.getUser()

    return (
        <div className="min-h-screen bg-[#0b0b0d] text-white selection:bg-purple-500/30 overflow-x-hidden">
            {/* Background Glow Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[120px]" />
                <div className="absolute top-[20%] -right-[10%] w-[30%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]" />
            </div>

            {/* Sticky Navigation Bar */}
            <nav className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-[#0b0b0d]/70 backdrop-blur-md">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                            <div className="w-2 h-6 bg-purple-600 rounded-full" />
                            <div className="w-2 h-6 bg-purple-400 rounded-full mt-1" />
                            <div className="w-2 h-6 bg-purple-200 rounded-full" />
                        </div>
                        <span className="font-bold tracking-tight text-xl text-white">Inventory Management</span>
                    </div>

                    {!user && (
                        <div className="flex items-center gap-6">
                            <Link href="/sign-in" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                                Log in
                            </Link>
                            <Link
                                href="/handler/sign-up?after_auth_return_to=%2Fsign-in"
                                className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-zinc-200 transition-all active:scale-95"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </nav>

            <div className="relative z-10 container mx-auto px-6 pt-20 pb-24 lg:pt-32">
                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest uppercase bg-zinc-800/40 border border-zinc-700/50 rounded-full text-zinc-500">
                        Smart Inventory Tracking
                    </span>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-600">
                        Inventory <br />
                        Management
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                        A comprehensive system designed to simplify your logistics. Track assets in real-time,
                        monitor stock health, and scale your business with precision.
                    </p>

                    <div className="flex justify-center">
                        <Link
                            href={user ? "/dashboard" : "/sign-in"}
                            className="px-10 py-4 bg-white text-black rounded-xl font-bold transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] active:scale-95"
                        >
                            {user ? "Go to Dashboard" : "Get Started Now"}
                        </Link>
                    </div>
                </div>

                {/* Dashboard Preview */}
                <div className="relative max-w-5xl mx-auto mb-32 p-2 rounded-[2.5rem] border border-zinc-800 bg-zinc-900/20 backdrop-blur-sm shadow-2xl overflow-hidden group">
                    <Preview />
                </div>

                {/* Footer */}
                <footer className="mt-40 pb-12 border-t border-zinc-900 pt-12 text-center">
                    <p className="text-zinc-600 text-sm italic tracking-wide">
                        © 2026 Matias Raimondi
                    </p>
                </footer>
            </div>
        </div>
    );
}
