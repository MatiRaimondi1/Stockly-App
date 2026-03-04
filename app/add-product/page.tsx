import Sidebar from "@/components/sidebar"
import { getCurrentUser } from "../lib/auth"
import Link from "next/link"
import { createProduct } from "../lib/actions/products"
import { PlusCircle, ArrowLeft, Package, DollarSign, List, Bell } from "lucide-react"
import { stackServerApp } from "@/stack/server"

export default async function AddProductPage() {
    const user = await getCurrentUser()
    const signOutUrl = stackServerApp.urls.signOut;
        const sidebarUser = {
            displayName: user.displayName ?? undefined,
            primaryEmail: user.primaryEmail ?? undefined,
        };

    const inputClasses = "w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all backdrop-blur-sm";
    const labelClasses = "flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1";

    return (
        <div className="min-h-screen bg-[#0b0b0d] text-zinc-400">
            <Sidebar
                user={sidebarUser}
                currentPath="/add-product"
                signOutUrl={signOutUrl}
            />

            <main className="ml-64 p-8 lg:p-12 relative">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/5 blur-[100px] pointer-events-none" />

                {/* Header */}
                <div className="relative mb-10">
                    <Link href="/inventory" className="flex items-center gap-2 text-zinc-500 hover:text-purple-400 transition-colors mb-4 text-sm font-medium group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Inventory
                    </Link>
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
                        Add Product
                    </h1>
                    <p className="text-zinc-500 font-medium">
                        Expand your catalog by adding a new asset to the system.
                    </p>
                </div>

                <div className="max-w-3xl">
                    <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] p-8 lg:p-10 backdrop-blur-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 px-6 py-2 bg-purple-600/10 border-b border-l border-purple-500/20 rounded-bl-2xl">
                            <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">New Entry</span>
                        </div>

                        <form className="space-y-8" action={createProduct}>
                            <div>
                                <label htmlFor="name" className={labelClasses}>
                                    <Package size={14} className="text-purple-500" />
                                    Product Name <span className="text-purple-500/50">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    className={inputClasses}
                                    placeholder="e.g. Premium Wireless Headphones"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label htmlFor="quantity" className={labelClasses}>
                                        <List size={14} className="text-purple-500" />
                                        Quantity <span className="text-purple-500/50">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        min="0"
                                        required
                                        className={inputClasses}
                                        placeholder="0"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="price" className={labelClasses}>
                                        <DollarSign size={14} className="text-purple-500" />
                                        Price (USD) <span className="text-purple-500/50">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        step="0.01"
                                        min="0"
                                        required
                                        className={inputClasses}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label htmlFor="sku" className={labelClasses}>
                                        <PlusCircle size={14} className="text-purple-500" />
                                        SKU Identifier
                                    </label>
                                    <input
                                        type="text"
                                        id="sku"
                                        name="sku"
                                        className={inputClasses}
                                        placeholder="WH-1000XM4"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="lowStockAt" className={labelClasses}>
                                        <Bell size={14} className="text-purple-500" />
                                        Low Stock Alert
                                    </label>
                                    <input
                                        type="number"
                                        id="lowStockAt"
                                        name="lowStockAt"
                                        min="0"
                                        className={inputClasses}
                                        placeholder="Threshold (default: 20)"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-8 py-4 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-500 shadow-[0_10px_20px_-10px_rgba(147,51,234,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    Create Product
                                </button>
                                <Link
                                    href="/inventory"
                                    className="px-8 py-4 bg-zinc-800 text-zinc-300 font-bold rounded-2xl hover:bg-zinc-700 hover:text-white transition-all text-center"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}
