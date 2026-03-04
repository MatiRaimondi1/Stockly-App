"use client";

import { usePathname } from "next/navigation";
import { BarChart3, Package, Plus } from "lucide-react";

function Skeleton({ className = "" }: { className?: string }) {
    return (
        <div className={`animate-pulse bg-zinc-800/50 rounded-xl ${className}`}></div>
    );
}

function LoadingSidebar() {
    const navigation = [
        { name: "Dashboard", icon: BarChart3 },
        { name: "Inventory", icon: Package },
        { name: "Add Product", icon: Plus },
    ];

    return (
        <div className="fixed left-0 top-0 bg-[#0b0b0d] border-r border-zinc-800/50 text-white w-64 min-h-screen flex flex-col z-20">
            {/* Header */}
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                        <div className="w-1.5 h-5 bg-purple-600 rounded-full" />
                        <div className="w-1.5 h-5 bg-purple-400 rounded-full mt-1" />
                        <div className="w-1.5 h-5 bg-purple-200 rounded-full" />
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                        Inventory Management
                    </span>
                </div>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 px-4 space-y-8 mt-4">
                <div>
                    <div className="px-3 mb-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                        Main Menu
                    </div>
                    <div className="space-y-1">
                        {navigation.map((item, key) => (
                            <div key={key} className="flex items-center gap-3 py-2.5 px-3 rounded-xl border border-transparent opacity-40">
                                <item.icon className="w-5 h-5 text-zinc-400" />
                                <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </nav>

            {/* User Section / Footer */}
            <div className="p-4 border-t border-zinc-800/50 bg-zinc-900/10">
                <div className="flex items-center gap-3 px-2">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-800/50 animate-pulse border border-zinc-800" />

                    <div className="flex-1 min-w-0">
                        <Skeleton className="h-3 w-24 mb-2" />
                        <Skeleton className="h-2 w-32 opacity-50" />
                    </div>

                    <div className="p-2 opacity-20">
                        <div className="w-[18px] h-[18px] bg-zinc-700 rounded-md animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function MainContentSkeleton({ showSidebar = true }: { showSidebar?: boolean }) {
    return (
        <main className={`${showSidebar ? "ml-64" : ""} p-8 relative min-h-screen bg-[#0b0b0d]`}>
            {/* Glow Effect */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] pointer-events-none" />

            <div className="mb-10 relative">
                <Skeleton className="h-9 w-40 mb-3 rounded-2xl" />
                <Skeleton className="h-4 w-72 rounded-lg opacity-40" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 relative">
                <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] p-8 backdrop-blur-md">
                    <Skeleton className="h-6 w-32 mb-8" />
                    <div className="grid grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-3">
                                <Skeleton className="h-8 w-16 mx-auto rounded-xl" />
                                <Skeleton className="h-3 w-20 mx-auto rounded-lg opacity-50" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] p-8 backdrop-blur-md">
                    <Skeleton className="h-6 w-44 mb-8" />
                    <Skeleton className="h-40 w-full rounded-3xl" />
                </div>
            </div>
        </main>
    );
}

export default function Loading() {
    const pathname = usePathname();
    const showSidebar = !["/", "/sign-in", "/sign-up"].includes(pathname);

    return (
        <div className="min-h-screen bg-[#0b0b0d]">
            {showSidebar && <LoadingSidebar />}
            <MainContentSkeleton showSidebar={showSidebar} />
        </div>
    );
}
