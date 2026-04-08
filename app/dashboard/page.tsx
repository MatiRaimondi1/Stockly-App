import Link from "next/link";
import { stackServerApp } from "@/stack/server";
import { getCurrentUser } from "../lib/auth";
import { AppDataSource } from "../lib/db";
import { Product } from "../lib/entities/Product";
import { LessThan } from "typeorm";
import { Package, DollarSign, AlertCircle, ArrowUpRight, Clock, House } from "lucide-react";
import ProductChart from "@/components/products-chart";
import Sidebar from "@/components/sidebar";

/**
 * Dashboard page component
 * @returns 
 */
export default async function DashboardPage() {
    /**
     * Initialize the database connection if not already initialized
     */
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    /**
     * Fetch the current user and their ID
     */
    const user = await getCurrentUser();
    const userId = user.id;
    const sidebarUser = {
        displayName: user.displayName ?? undefined,
        primaryEmail: user.primaryEmail ?? undefined,
    };

    /**
     * Fetch the sign-out URL
     */
    const signOutUrl = stackServerApp.urls.signOut;

    /**
     * Fetch product data
     */
    const productRepository = AppDataSource.getRepository(Product);
    const [totalProducts, lowStock, allProducts] = await Promise.all([
        productRepository.count({ where: { userId } }),
        productRepository.count({
            where: { userId, quantity: LessThan(20) }
        }),
        productRepository.find({
            where: { userId },
            select: { name: true, price: true, quantity: true, createdAt: true },
        })
    ]);
    const totalValue = allProducts.reduce((sum, product) => sum + Number(product.price) * Number(product.quantity), 0);
    const inStockPercentage = totalProducts > 0 ? Math.round(((totalProducts - lowStock) / totalProducts) * 100) : 0;

    /**
     * Generate weekly product data for the chart
     */
    const now = new Date();
    const weeklyProductsData = [];
    for (let i = 11; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - i * 7);
        weekStart.setHours(0, 0, 0, 0);
        const weekLabel = `${String(weekStart.getMonth() + 1).padStart(2, "0")}/${String(weekStart.getDate()).padStart(2, "0")}`;
        const count = allProducts.filter(p => {
            const d = new Date(p.createdAt);
            return d >= weekStart && d <= new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
        }).length;
        weeklyProductsData.push({ week: weekLabel, products: count });
    }

    /**
     * Fetch recent products
     */
    const recent = [...allProducts]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    return (
        <div className="min-h-screen bg-[#0b0b0d] text-zinc-400 selection:bg-purple-500/30">
            {/* Sidebar */}
            <Sidebar
                user={sidebarUser}
                currentPath="/dashboard"
                signOutUrl={signOutUrl}
            />

            {/* Main Content */}
            <main className="ml-64 p-8 lg:p-12 relative overflow-hidden">
                {/* Background */}
                <div className="absolute top-[-10%] right-[-5%] w-150 h-150 bg-purple-600/10 blur-[150px] pointer-events-none rounded-full" />
                <div className="absolute bottom-[-10%] left-0 w-100 h-100 bg-blue-600/5 blur-[120px] pointer-events-none rounded-full" />

                {/* Header Section */}
                <header className="relative mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-purple-500 font-bold text-xs uppercase tracking-[0.2em]">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                            System Active
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter">
                            Overview
                        </h1>
                    </div>
                    <div className="text-right">
                        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-6 text-sm font-bold group bg-zinc-900/50 px-4 py-2 rounded-xl border border-zinc-800">
                            <House size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Home
                        </Link>
                    </div>
                </header>

                {/* Metrics Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {[
                        { label: "Total Asset Items", value: totalProducts, icon: Package, color: "text-blue-400", bg: "bg-blue-400/10" },
                        { label: "Operational Value", value: `$${totalValue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                        { label: "Critical Stock", value: lowStock, icon: AlertCircle, color: "text-red-400", bg: "bg-red-400/10" },
                    ].map((m, i) => (
                        <div key={i} className="group relative bg-zinc-900/40 border border-zinc-800/50 p-7 rounded-4xl backdrop-blur-xl transition-all hover:border-zinc-700">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-4 rounded-2xl ${m.bg} ${m.color} transition-transform group-hover:scale-110`}>
                                    <m.icon size={24} />
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/50 text-[10px] font-bold text-zinc-300 uppercase tracking-wider">
                                    <Clock size={12} /> Real-time
                                </div>
                            </div>
                            <div className="text-4xl font-black text-white tracking-tighter mb-1">{m.value}</div>
                            <div className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">{m.label}</div>
                        </div>
                    ))}
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chart Card */}
                    <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] p-8 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Inventory Growth</h3>
                                <p className="text-sm text-zinc-500">Distribution of new items added per week</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="px-4 py-2 rounded-xl bg-zinc-800 text-xs font-bold text-white cursor-default">Last 12 Weeks</div>
                            </div>
                        </div>
                        <div className="h-80 w-full">
                            <ProductChart data={weeklyProductsData} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-8">
                        {/* Inventory Health Gauge */}
                        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] p-8 backdrop-blur-xl flex flex-col items-center">
                            <div className="w-full flex justify-between items-center mb-8">
                                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Health Score</h3>
                                <ArrowUpRight className="text-zinc-600" size={20} />
                            </div>

                            <div className="relative w-48 h-48 flex items-center justify-center">
                                {/* SVG Progress Circle */}
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="96" cy="96" r="85" stroke="currentColor" strokeWidth="14" fill="transparent" className="text-zinc-800/50" />
                                    <circle cx="96" cy="96" r="85" stroke="currentColor" strokeWidth="14" fill="transparent"
                                        strokeDasharray={534}
                                        strokeDashoffset={534 - (534 * inStockPercentage) / 100}
                                        className="text-purple-600 transition-all duration-1000 ease-out"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black text-white">{inStockPercentage}%</span>
                                    <span className="text-[10px] font-black uppercase text-purple-400 tracking-widest">Efficiency</span>
                                </div>
                            </div>
                            <p className="mt-8 text-center text-xs text-zinc-500 leading-relaxed">
                                {inStockPercentage > 80 ? "Your stock levels are within optimal parameters." : "Consider restocking low inventory items soon."}
                            </p>
                        </div>

                        {/* Recent Activity List */}
                        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] p-8 backdrop-blur-xl">
                            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6">Recent Activity</h3>
                            <div className="space-y-4">
                                {recent.map((product, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${product.quantity < 20 ? 'bg-red-500/10 text-red-500' : 'bg-zinc-800 text-zinc-400'}`}>
                                                <Package size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-zinc-200 truncate max-w-30">{product.name}</p>
                                                <p className="text-[10px] font-medium text-zinc-500">{new Date(product.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right font-mono text-xs">
                                            <p className={`font-bold ${product.quantity < 20 ? 'text-red-400' : 'text-zinc-400'}`}>{product.quantity}</p>
                                            <p className="text-zinc-600">UNITS</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}