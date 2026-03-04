import { BarChart3, Package, Plus, LogOut } from "lucide-react";
import Link from "next/link";

interface SidebarProps {
    user: {
        displayName?: string;
        primaryEmail?: string;
    } | null;
    currentPath?: string;
    signOutUrl: string;
}

export default async function Sidebar({ user, currentPath = "/dashboard", signOutUrl }: SidebarProps) {
    const navigation = [
        { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
        { name: "Inventory", href: "/inventory", icon: Package },
        { name: "Add Product", href: "/add-product", icon: Plus },
    ]

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
                        {navigation.map((item, key) => {
                            const IconComponent = item.icon;
                            const isActive = item.href === currentPath;
                            return (
                                <Link
                                    href={item.href}
                                    key={key}
                                    className={`flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all duration-200 group
                                        ${isActive
                                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                            : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white border border-transparent'
                                        }`}
                                >
                                    <IconComponent className={`w-5 h-5 ${isActive ? 'text-purple-400' : 'group-hover:text-white'}`} />
                                    <span className="text-sm font-medium">{item.name}</span>
                                    {isActive && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-800/50 bg-zinc-900/10">
                <div className="flex items-center gap-3 px-2">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border border-zinc-700">
                        <span className="text-white text-sm font-medium">
                            {user?.displayName?.charAt(0) || user?.primaryEmail?.charAt(0).toUpperCase()}
                        </span>
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-zinc-100 truncate">
                            {user?.displayName || "User Name"}
                        </p>
                        <p className="text-xs text-zinc-500 truncate">
                            {user?.primaryEmail || "user@email.com"}
                        </p>
                    </div>

                    <a 
                        href={signOutUrl}
                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all group"
                        title="Sign out"
                    >
                        <LogOut size={18} className="group-active:scale-90 transition-transform" />
                    </a>
                </div>
            </div>
        </div>
    ) 
}
