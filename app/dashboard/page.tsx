import { TrendingUp, Package, DollarSign, AlertCircle } from "lucide-react";
import { getCurrentUser } from "../lib/auth";
import { AppDataSource } from "../lib/db";
import { Product } from "../lib/entities/Product";
import Sidebar from "@/components/sidebar";
import { LessThan } from "typeorm";
import ProductChart from "@/components/products-chart";
import { stackServerApp } from "@/stack/server";

export default async function DashboardPage() {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    const user = await getCurrentUser();
    const userId = user.id;
    const signOutUrl = stackServerApp.urls.signOut;
    const sidebarUser = {
        displayName: user.displayName ?? undefined,
        primaryEmail: user.primaryEmail ?? undefined,
    };


    const productRepository = AppDataSource.getRepository(Product);

    const [totalProducts, lowStock, allProducts] = await Promise.all([
        productRepository.count({where: {userId: userId}}),
        productRepository.count({
            where: { userId, quantity: LessThan(20) }
        }),
        productRepository.find({
            where: { userId },
            select: { price: true, quantity: true, createdAt: true },
        })
    ]);

    const totalValue = allProducts.reduce((sum, product) => sum + Number(product.price) * Number(product.quantity), 0);
    const inStockPercentage = totalProducts > 0 ? Math.round(((totalProducts - lowStock) / totalProducts) * 100) : 0;

    const now = new Date();
    const weeklyProductsData = [];
    for (let i = 11; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - i * 7);
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        const weekLabel = `${String(weekStart.getMonth() + 1).padStart(2, "0")}/${String(weekStart.getDate()).padStart(2, "0")}`;
        const count = allProducts.filter(p => {
            const d = new Date(p.createdAt);
            return d >= weekStart && d <= weekEnd;
        }).length;
        weeklyProductsData.push({ week: weekLabel, products: count });
    }

    const recent = await productRepository.find({
        where: { userId },
        order: { createdAt: "DESC" },
        take: 5,
    });

    return (
        <div className="min-h-screen bg-[#0b0b0d] text-zinc-400 selection:bg-purple-500/30">
            <Sidebar 
                user={sidebarUser} 
                currentPath="/dashboard" 
                signOutUrl={signOutUrl} 
            />
            
            <main className="ml-64 p-8 lg:p-12 relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] pointer-events-none" />

                {/* Header Section */}
                <div className="relative mb-12">
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
                        Dashboard
                    </h1>
                    <p className="text-zinc-500 font-medium">
                        Welcome back, <span className="text-purple-400">{user.displayName || 'User'}</span>. Here's your inventory status.
                    </p>
                </div>
                
                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                        { label: "Total Products", value: totalProducts, icon: Package, color: "text-blue-400" },
                        { label: "Inventory Value", value: `$${totalValue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-400" },
                        { label: "Low Stock Items", value: lowStock, icon: AlertCircle, color: "text-red-400" },
                    ].map((m, i) => (
                        <div key={i} className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-3xl backdrop-blur-md">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl bg-zinc-800/50 ${m.color}`}>
                                    <m.icon size={20} />
                                </div>
                                <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg flex items-center gap-1">
                                    <TrendingUp size={12} /> Live
                                </span>
                            </div>
                            <div className="text-3xl font-bold text-white tracking-tight">{m.value}</div>
                            <div className="text-sm text-zinc-500 mt-1">{m.label}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chart */}
                    <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 backdrop-blur-md">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-white">Growth Analysis</h3>
                            <span className="text-xs text-zinc-500 font-mono uppercase tracking-widest">New products / week</span>
                        </div>
                        <div className="h-[300px] w-full">
                            <ProductChart data={weeklyProductsData} />
                        </div>
                    </div>

                    {/* Stock Health & Efficiency */}
                    <div className="flex flex-col gap-8">
                        {/* Circular Progress */}
                        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 backdrop-blur-md flex flex-col items-center">
                            <h3 className="text-sm font-bold text-white mb-6 self-start">Inventory Health</h3>
                            <div className="relative w-40 h-40 mb-6">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-zinc-800" />
                                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" 
                                        strokeDasharray={440} 
                                        strokeDashoffset={440 - (440 * inStockPercentage) / 100} 
                                        className="text-purple-500 transition-all duration-1000 ease-out" 
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black text-white">{inStockPercentage}%</span>
                                    <span className="text-[10px] uppercase tracking-tighter text-zinc-500 font-bold">Optimal</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Items List */}
                        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-6 backdrop-blur-md">
                            <h3 className="text-sm font-bold text-white mb-4">Recent Stock</h3>
                            <div className="space-y-3">
                                {recent.map((product, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-zinc-800/30 border border-zinc-700/20">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${product.quantity < 20 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-emerald-500'}`} />
                                            <span className="text-sm font-medium text-zinc-200 truncate max-w-[120px]">{product.name}</span>
                                        </div>
                                        <span className="text-xs font-mono font-bold text-zinc-500">{product.quantity} units</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
