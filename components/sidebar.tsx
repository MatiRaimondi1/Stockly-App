import Link from "next/link";
import { BarChart3, Package, Plus, LogOut } from "lucide-react";

/**
 * Props for the Sidebar component
 */
interface SidebarProps {
    user: {
        displayName?: string;
        primaryEmail?: string;
    } | null;
    currentPath?: string;
    signOutUrl: string;
}

/**
 * Sidebar component
 * @param param0 
 * @returns 
 */
export default async function Sidebar({ user, currentPath = "/dashboard", signOutUrl }: SidebarProps) {
    /**
     * Navigation items for the sidebar
     */
    const navigation = [
        { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
        { name: "Inventory", href: "/inventory", icon: Package },
        { name: "Add Product", href: "/add-product", icon: Plus },
    ];

    return (
        <aside className="fixed left-0 top-0 bg-[#0b0b0d] border-r border-zinc-800/40 text-white w-64 min-h-screen flex flex-col z-30 shadow-2xl">
            {/* Brand Header */}
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

            {/* Navigation Section */}
            <nav className="flex-1 px-4 mt-2 space-y-8">
                {/* Main Menu */}
                <div>
                    <h3 className="px-4 mb-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.25em]">
                        Management
                    </h3>
                    <div className="space-y-1.5">
                        {navigation.map((item, key) => {
                            const Icon = item.icon;
                            const isActive = item.href === currentPath;
                            return (
                                <Link
                                    href={item.href}
                                    key={key}
                                    className={`group relative flex items-center gap-3.5 py-3 px-4 rounded-2xl transition-all duration-300 
                                        ${isActive
                                            ? 'bg-purple-600/10 text-white border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.05)]'
                                            : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/30 border border-transparent'
                                        }`}
                                >
                                    {isActive && (
                                        <div className="absolute -left-1 w-1 h-5 bg-purple-500 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
                                    )}
                                    <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-purple-400' : 'group-hover:text-zinc-300'}`} />
                                    <span className={`text-sm font-bold tracking-tight ${isActive ? 'text-white' : ''}`}>
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* User Profile Footer */}
            <div className="p-4 mt-auto border-t border-zinc-800/50 bg-zinc-900/20 backdrop-blur-md">
                <div className="flex items-center gap-3 bg-zinc-900/40 p-3 rounded-[1.25rem] border border-zinc-800/50">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-linear-to-br from-purple-600 to-indigo-600 flex items-center justify-center border border-white/10 shadow-lg">
                        <span className="text-white text-xs font-black">
                            {user?.displayName?.charAt(0) || user?.primaryEmail?.charAt(0).toUpperCase()}
                        </span>
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-white truncate tracking-tight">
                            {user?.displayName || "Operator"}
                        </p>
                        <p className="text-[10px] text-zinc-500 truncate font-mono uppercase tracking-tighter">
                            {user?.primaryEmail || "System Root"}
                        </p>
                    </div>

                    <a
                        href={signOutUrl}
                        className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                        title="Disconnect"
                    >
                        <LogOut size={18} />
                    </a>
                </div>
            </div>
        </aside>
    );
}