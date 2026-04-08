import Link from "next/link";
import { stackServerApp } from "@/stack/server";
import { Github, Linkedin, ArrowRight, Package, TrendingUp, PieChart, LogOut } from "lucide-react";
import { FadeIn, FloatingPreview } from "@/components/motion-wrapper";
import { FeatureCard } from "@/components/feature-card";
import Preview from "@/components/preview";

/**
 * Home page component
 * @returns 
 */
export default async function Home() {
    /**
     * Fetch user
     */
    const user = await stackServerApp.getUser();

    return (
        <div className="min-h-screen bg-[#0b0b0d] text-white selection:bg-purple-500/30 overflow-x-hidden">
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px] animate-pulse" />
                <div className="absolute top-[20%] -right-[10%] w-[30%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

            {/* Navigation */}
            <nav className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-[#0b0b0d]/70 backdrop-blur-md">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="p-8">
                        <div className="flex items-center gap-3.5 group cursor-default">
                            <div className="relative flex items-center justify-center">
                                <div className="w-2.5 h-6 bg-purple-600 rounded-full blur-[2px] absolute animate-pulse" />
                                <div className="flex gap-1 relative">
                                    <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
                                    <div className="w-1.5 h-6 bg-purple-400 rounded-full mt-1.5" />
                                    <div className="w-1.5 h-6 bg-purple-300 rounded-full" />
                                </div>
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-lg font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-br from-white via-white to-zinc-500">
                                    STOCKLY
                                </span>
                                <span className="text-[9px] font-bold text-purple-500/80 uppercase tracking-[0.3em]">
                                    Enterprise
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {!user ? (
                            <>
                                <Link href="/sign-in" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                                    Log in
                                </Link>
                                <Link
                                    href="/handler/sign-up"
                                    className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all active:scale-95"
                                >
                                    Get Started
                                </Link>
                            </>
                        ) : (
                            <Link href="/handler/sign-out" className="group flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-red-400 transition-colors">
                                <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />Log out
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 container mx-auto px-6 pt-20 pb-24 lg:pt-32">
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <FadeIn>
                        <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-bold tracking-widest uppercase bg-zinc-800/40 border border-zinc-700/50 rounded-full text-purple-400">
                            ✦ Smart Inventory Tracking
                        </span>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-linear-to-b from-white via-white to-zinc-600">
                            Stockly
                        </h1>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-zinc-200 mb-8">
                            Intelligent inventory. <span className="text-purple-500">Zero guesswork.</span>
                        </h2>
                    </FadeIn>

                    <FadeIn delay={0.3}>
                        <p className="text-lg md:text-xl text-zinc-400 mb-12 leading-relaxed max-w-2xl mx-auto">
                            Manage your items, track real-time stock levels, and let our
                            predictive analytics find your optimal inventory balance.
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.3}>
                        <div className="flex justify-center">
                            <Link
                                href={user ? "/dashboard" : "/sign-in"}
                                className="group flex items-center gap-2 px-10 py-4 bg-white text-black rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
                            >
                                {user ? "Go to Dashboard" : "Get Started Now"}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </FadeIn>
                </div>

                {/* Preview Section */}
                <FloatingPreview>
                    <div className="relative max-w-5xl mx-auto mb-32 p-1 rounded-[2.5rem] bg-linear-to-b from-zinc-700/50 to-transparent shadow-2xl">
                        <div className="rounded-[2.4rem] overflow-hidden bg-zinc-900">
                            <Preview />
                        </div>
                    </div>
                </FloatingPreview>
                
                {/* Features Section */}
                <section className="relative z-10 py-24 border-t border-zinc-900/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        <FeatureCard
                            index={0}
                            title="Item Management"
                            description="Add and organize products with ease. Assign categories and SKUs for precise tracking."
                        >
                            <Package className="h-6 w-6" />
                        </FeatureCard>

                        <FeatureCard
                            index={1}
                            title="Optimal Stock Levels"
                            description="Our algorithm calculates the ideal stock percentage to ensure you never run out or overstock."
                        >
                            <TrendingUp className="h-6 w-6" />
                        </FeatureCard>

                        <FeatureCard
                            index={2}
                            title="Visual Statistics"
                            description="Dynamic and intuitive charts that allow you to visualize inventory turnover in seconds."
                        >
                            <PieChart className="h-6 w-6" />
                        </FeatureCard>
                    </div>
                </section>

                {/* Footer */}
                <footer className="mt-40 border-t border-zinc-900 pt-12 text-center">
                    <p className="text-sm italic text-zinc-600">© 2026 Matias Raimondi</p>
                    <div className="flex justify-center gap-6 mt-6">
                        <a href="https://github.com/MatiRaimondi1" className="text-zinc-500 hover:text-white transition-colors"><Github /></a>
                        <a href="https://www.linkedin.com/in/mat%C3%ADas-raimondi/" className="text-zinc-500 hover:text-white transition-colors"><Linkedin /></a>
                    </div>
                </footer>
            </main >
        </div >
    );
}