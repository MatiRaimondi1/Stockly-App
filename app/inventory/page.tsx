import Link from "next/link";
import { stackServerApp } from "@/stack/server";
import { AppDataSource } from "../lib/db";
import { Product } from "../lib/entities/Product";
import { getCurrentUser } from "../lib/auth";
import { deleteProduct } from "../lib/actions/products";
import { ILike } from "typeorm";
import { Search, Trash2, Package, Tag, AlertTriangle } from "lucide-react";
import Sidebar from "@/components/sidebar";
import Pagination from "@/components/pagination";

/**
 * Inventory page component
 * @param param0 
 * @returns 
 */
export default async function InventoryPage({ searchParams }: { searchParams: Promise<{ q?: string, page?: string }> }) {
    /**
     * Initialize the database connection if not already initialized
     */
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    /**
     * Fetch the current user
     */
    const user = await getCurrentUser();
    const userId = user.id;
    const sidebarUser = {
        displayName: user.displayName ?? undefined,
        primaryEmail: user.primaryEmail ?? undefined,
    };

    /**
     * Fetch the sign out URL
     */
    const signOutUrl = stackServerApp.urls.signOut;
    
    /**
     * Parse search parameters
     */
    const params = await searchParams;
    const q = (params.q ?? "").trim();
    const page = Math.max(1, Number(params.page ?? 1));
    const pageSize = 10;

    /**
     * Fetch products based on search criteria
     */
    const productRepository = AppDataSource.getRepository(Product);
    const where = {
        userId,
        ...(q ? { name: ILike(`%${q}%`) } : {})
    }
    const [totalCount, items] = await Promise.all([
        productRepository.count({ where }),
        productRepository.find({
            where: where,
            order: { createdAt: "DESC" },
            skip: (page - 1) * pageSize,
            take: pageSize
        }),
    ]);
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return (
        <div className="min-h-screen bg-[#0b0b0d] text-zinc-400 selection:bg-purple-500/30">
            {/* Sidebar */}
            <Sidebar
                user={sidebarUser}
                currentPath="/inventory"
                signOutUrl={signOutUrl}
            />

            {/* Main Content */}
            <main className="ml-64 p-8 lg:p-12 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-[-10%] left-[-10%] w-150 h-150 bg-purple-600/5 blur-[120px] pointer-events-none rounded-full" />

                {/* Header Section */}
                <div className="relative mb-12 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Assets</span>
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter mb-2">Inventory</h1>
                        <p className="text-zinc-500 font-medium max-w-md text-sm leading-relaxed">
                            Total of <span className="text-zinc-200">{totalCount} items</span> registered in your local database.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* Search Bar */}
                        <div className="w-full sm:w-80 group">
                            <form className="relative" action="/inventory" method="GET">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-purple-500 transition-colors" />
                                <input
                                    name="q"
                                    defaultValue={q}
                                    placeholder="Search assets..."
                                    className="w-full bg-zinc-900/40 border border-zinc-800/80 p-3 pl-11 rounded-2xl text-white placeholder:text-zinc-700 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/50 transition-all backdrop-blur-xl"
                                />
                            </form>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                {items.length > 0 ? (
                    <div className="relative bg-zinc-900/20 border border-zinc-800/50 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-zinc-800/50">
                                        <th className="px-8 py-6 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Asset Info</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Reference</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Financials</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Stock Control</th>
                                        <th className="px-8 py-6 text-right text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Management</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800/30">
                                    {items.map((product) => {
                                        const isLowStock = product.quantity <= (product.lowStockAt || 20);
                                        const isOutOfStock = product.quantity === 0;

                                        return (
                                            <tr key={product.id} className="group hover:bg-white/3 transition-all">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-zinc-800/40 flex items-center justify-center border border-zinc-700/30 group-hover:border-purple-500/30 transition-colors">
                                                            <Package className="w-6 h-6 text-zinc-500 group-hover:text-purple-400 transition-colors" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-zinc-100 group-hover:text-white transition-colors">{product.name}</span>
                                                            <span className="text-[10px] text-zinc-600 font-mono">ID: {product.id.toString().slice(-6)}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="px-3 py-1 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-xs font-mono text-zinc-400">
                                                        {product.sku || "NO_SKU"}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-1.5 text-emerald-400 font-black">
                                                            <Tag size={12} />
                                                            ${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                        </div>
                                                        <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-tighter">Market Price</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`h-2.5 w-24 rounded-full bg-zinc-800 overflow-hidden`}>
                                                                <div
                                                                    className={`h-full transition-all duration-1000 ${isOutOfStock ? 'bg-zinc-800' : isLowStock ? 'bg-orange-500' : 'bg-purple-500'}`}
                                                                    style={{ width: `${Math.min((product.quantity / 100) * 100, 100)}%` }}
                                                                />
                                                            </div>
                                                            <span className={`text-sm font-black ${isOutOfStock ? 'text-red-500' : isLowStock ? 'text-orange-400' : 'text-zinc-200'}`}>
                                                                {product.quantity}
                                                            </span>
                                                        </div>
                                                        {(isLowStock || isOutOfStock) && (
                                                            <div className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-widest ${isOutOfStock ? 'text-red-500 animate-pulse' : 'text-orange-500'}`}>
                                                                <AlertTriangle size={10} /> {isOutOfStock ? 'Critical: Out of Stock' : 'Warning: Low Stock'}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <form action={async (formData: FormData) => {
                                                        "use server"
                                                        await deleteProduct(formData);
                                                    }} className="inline-block">
                                                        <input type="hidden" name="id" value={product.id} />
                                                        <button className="p-3 rounded-2xl text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-90 border border-transparent hover:border-red-500/20">
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </form>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 bg-zinc-900/10 border border-dashed border-zinc-800 rounded-[2.5rem]">
                        <div className="w-20 h-20 bg-zinc-800/30 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
                            <Package className="w-10 h-10 text-zinc-700" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
                        <p className="text-zinc-500 mb-8 max-w-xs text-center">We couldn't find any items matching your search or inventory is empty.</p>
                        <Link href="/add-product" className="px-8 py-3 bg-zinc-800 text-white rounded-xl font-bold hover:bg-zinc-700 transition-colors">
                            Add your first item
                        </Link>
                    </div>
                )}

                {/* Pagination Section */}
                {totalPages > 1 && (
                    <div className="mt-12 flex justify-center">
                        <div className="bg-zinc-950/50 border border-zinc-800/80 p-1.5 rounded-2xl backdrop-blur-xl shadow-2xl">
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                baseUrl="/inventory"
                                searchParams={{ q, pageSize: String(pageSize) }}
                            />
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}