import Sidebar from "@/components/sidebar";
import { AppDataSource } from "../lib/db";
import { Product } from "../lib/entities/Product";
import { getCurrentUser } from "../lib/auth";
import { deleteProduct } from "../lib/actions/products";
import { ILike } from "typeorm";
import Pagination from "@/components/pagination";
import { Search, Trash2, Package, Tag, AlertTriangle } from "lucide-react";
import { stackServerApp } from "@/stack/server";

export default async function InventoryPage({ searchParams }: { searchParams: Promise<{ q?: string, page?: string }> }) {
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

    const params = await searchParams;
    const q = (params.q ?? "").trim();
    const page = Math.max(1, Number(params.page ?? 1));
    const pageSize = 10;

    const productRepository = AppDataSource.getRepository(Product);

    const where = {
        userId,
        ...(q ? { name: ILike(`%${q}%`) } : {})
    }

    const [totalCount, items] = await Promise.all([
        productRepository.count({ where }),
        productRepository.find({ where: where, order: { createdAt: "DESC" }, skip: (page - 1) * pageSize, take: pageSize }),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

    return (
        <div className="min-h-screen bg-[#0b0b0d] text-zinc-400">
            <Sidebar
                user={sidebarUser}
                currentPath="/inventory"
                signOutUrl={signOutUrl}
            />

            <main className="ml-64 p-8 lg:p-12 relative">
                {/* Glow Effect */}
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] pointer-events-none" />

                {/* Header */}
                <div className="relative mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Inventory</h1>
                        <p className="text-zinc-500 font-medium">Manage assets and monitor real-time stock levels.</p>
                    </div>

                    {/* Search Bar */}
                    <div className="w-full md:w-96">
                        <form className="relative group" action="/inventory" method="GET">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
                            <input
                                name="q"
                                defaultValue={q}
                                placeholder="Search by name..."
                                className="w-full bg-zinc-900/40 border border-zinc-800 p-3 pl-11 rounded-2xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all backdrop-blur-md"
                            />
                        </form>
                    </div>
                </div>

                {/* Table Container */}
                <div className="relative bg-zinc-900/40 border border-zinc-800/50 rounded-[2rem] overflow-hidden backdrop-blur-md">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-800/50">
                                    <th className="px-6 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Product Details</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">SKU</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Price</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Stock Status</th>
                                    <th className="px-6 py-5 text-right text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/30">
                                {items.map((product, key) => {
                                    const isLowStock = product.quantity <= (product.lowStockAt || 20);
                                    const isOutOfStock = product.quantity === 0;

                                    return (
                                        <tr key={key} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-zinc-800/50 flex items-center justify-center border border-zinc-700/30">
                                                        <Package className="w-5 h-5 text-purple-400" />
                                                    </div>
                                                    <span className="font-semibold text-zinc-100">{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 font-mono text-xs text-zinc-500">
                                                {product.sku || "N/A"}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-1 text-emerald-400 font-medium">
                                                    <Tag className="w-3 h-3" />
                                                    ${Number(product.price).toFixed(2)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <span className={`text-sm font-bold ${isOutOfStock ? 'text-red-500' : isLowStock ? 'text-orange-400' : 'text-zinc-200'}`}>
                                                        {product.quantity} units
                                                    </span>
                                                    {(isLowStock || isOutOfStock) && (
                                                        <span className={`flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${isOutOfStock ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'}`}>
                                                            <AlertTriangle size={10} /> {isOutOfStock ? 'Empty' : 'Low'}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <form action={async (formData: FormData) => {
                                                    "use server"
                                                    await deleteProduct(formData);
                                                }}>
                                                    <input type="hidden" name="id" value={product.id} />
                                                    <button className="p-2.5 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all active:scale-90">
                                                        <Trash2 size={18} />
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

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                        <div className="bg-zinc-900/40 border border-zinc-800/50 px-4 py-2 rounded-2xl backdrop-blur-md">
                            <Pagination currentPage={page} totalPages={totalPages} baseUrl="/inventory" searchParams={{ q, pageSize: String(pageSize) }} />
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
