import Link from "next/link"
import { stackServerApp } from "@/stack/server"
import { getCurrentUser } from "../lib/auth"
import { createProduct } from "../lib/actions/products"
import { ArrowLeft, Package, DollarSign, List, Bell, Zap } from "lucide-react"
import Sidebar from "@/components/sidebar"

/**
 * Add Product page component
 * @returns 
 */
export default async function AddProductPage() {
    /**
     * Fetch the current user and their ID
     */
    const user = await getCurrentUser()
    const sidebarUser = {
        displayName: user.displayName ?? undefined,
        primaryEmail: user.primaryEmail ?? undefined,
    };

    /**
     * Fetch the sign-out URL
     */
    const signOutUrl = stackServerApp.urls.signOut;

    /**
     * Define CSS classes for form inputs and labels
     */
    const inputClasses = "w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/50 transition-all backdrop-blur-xl shadow-inner";
    const labelClasses = "flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3 ml-1";

    return (
        <div className="min-h-screen bg-[#0b0b0d] text-zinc-400 selection:bg-purple-500/30">
            {/* Sidebar */}
            <Sidebar
                user={sidebarUser}
                currentPath="/add-product"
                signOutUrl={signOutUrl}
            />

            {/* Main Content */}
            <main className="ml-64 p-8 lg:p-12 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-[-10%] right-[-5%] w-125 h-125 bg-purple-600/10 blur-[120px] pointer-events-none rounded-full" />
                <div className="absolute bottom-[-5%] left-[10%] w-75 h-75 bg-blue-600/5 blur-[100px] pointer-events-none rounded-full" />

                {/* Header Section */}
                <div className="relative mb-12">
                    <Link href="/inventory" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-6 text-sm font-bold group bg-zinc-900/50 px-4 py-2 rounded-xl border border-zinc-800">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Return to Fleet
                    </Link>
                    <h1 className="text-5xl font-black text-white tracking-tighter mb-3">
                        Register Asset
                    </h1>
                    <p className="text-zinc-500 font-medium max-w-xxl leading-relaxed">
                        Insert a new high-value asset into your synchronized inventory system. Ensure all mandatory fields are validated.
                    </p>
                </div>

                <div className="max-w-4xl relative">
                    <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-[3rem] p-10 lg:p-14 backdrop-blur-2xl shadow-2xl overflow-hidden">
                        {/* Status Tag */}
                        <div className="absolute top-0 right-0 px-8 py-3 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-bl-3xl shadow-lg">
                            System Write Access
                        </div>

                        <form className="space-y-10" action={createProduct}>

                            {/* Section: General Info */}
                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-8 h-px bg-zinc-800" />
                                    <h2 className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em]">Basic Identification</h2>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className={labelClasses}>
                                            <Package size={14} className="text-purple-500" />
                                            Asset Designation <span className="text-purple-500/50">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            className={inputClasses}
                                            placeholder="e.g. Neural Link Processor X1"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label htmlFor="sku" className={labelClasses}>
                                                <Zap size={14} className="text-purple-500" />
                                                Internal SKU
                                            </label>
                                            <input
                                                type="text"
                                                id="sku"
                                                name="sku"
                                                className={inputClasses}
                                                placeholder="NLP-X1-2026"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="price" className={labelClasses}>
                                                <DollarSign size={14} className="text-purple-500" />
                                                Unit Value (USD) <span className="text-purple-500/50">*</span>
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
                                </div>
                            </section>

                            {/* Section: Logistics */}
                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-8 h-px bg-zinc-800" />
                                    <h2 className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em]">Logistics & Monitoring</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label htmlFor="quantity" className={labelClasses}>
                                            <List size={14} className="text-purple-500" />
                                            Initial Stock <span className="text-purple-500/50">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            id="quantity"
                                            name="quantity"
                                            min="0"
                                            required
                                            className={inputClasses}
                                            placeholder="Quantity on hand"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="lowStockAt" className={labelClasses}>
                                            <Bell size={14} className="text-purple-500" />
                                            Alert Threshold
                                        </label>
                                        <input
                                            type="number"
                                            id="lowStockAt"
                                            name="lowStockAt"
                                            min="0"
                                            className={inputClasses}
                                            placeholder="Notify at (default: 20)"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-5 pt-10">
                                <button
                                    type="submit"
                                    className="flex-2 px-10 py-5 bg-linear-to-r from-purple-600 to-indigo-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:from-purple-500 hover:to-indigo-500 shadow-[0_20px_40px_-15px_rgba(147,51,234,0.4)] active:scale-[0.97] transition-all flex items-center justify-center gap-3"
                                >
                                    Confirm
                                </button>
                                <Link
                                    href="/inventory"
                                    className="flex-1 px-10 py-5 bg-zinc-800/50 text-zinc-400 font-bold uppercase text-xs tracking-widest rounded-2xl hover:bg-zinc-800 hover:text-white border border-zinc-700/50 transition-all text-center flex items-center justify-center"
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