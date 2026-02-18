"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tag, MessageSquare, LogOut, Home, Layers } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkUser() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/login");
            } else {
                setLoading(false);
            }
        }
        checkUser();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
        { name: "Products", icon: Package, href: "/admin/products" },
        { name: "Categories", icon: Tag, href: "/admin/categories" },
        { name: "Material Types", icon: Layers, href: "/admin/variations" },
        { name: "Reviews", icon: MessageSquare, href: "/admin/reviews" },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex-col hidden md:flex">
                <div className="p-6 border-b border-gray-100">
                    <Link href="/admin" className="flex items-center gap-2 font-bold text-xl text-black">
                        Prasanthi<span className="text-yellow-500">Admin</span>
                    </Link>
                </div>
                <nav className="flex-1 p-3 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? "bg-yellow-50 text-yellow-600 font-semibold"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-black"
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? "text-yellow-500" : ""}`} />
                                <span className="text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-3 border-t border-gray-100 space-y-1">
                    <Link
                        href="/"
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-black rounded-xl transition-colors text-sm"
                    >
                        <Home className="w-5 h-5" />
                        <span>View Store</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-gray-50/50">
                {/* Top Bar (mobile) */}
                <div className="md:hidden flex justify-between items-center bg-white p-4 border-b border-gray-100 sticky top-0 z-30">
                    <Link href="/admin" className="text-lg font-bold">Prasanthi<span className="text-yellow-500">Admin</span></Link>
                    <button onClick={handleLogout} className="text-sm text-red-500 font-medium">Logout</button>
                </div>
                {/* Mobile nav */}
                <div className="md:hidden flex gap-1 p-3 bg-white border-b border-gray-100 overflow-x-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${isActive
                                    ? "bg-yellow-50 text-yellow-600"
                                    : "text-gray-500 hover:bg-gray-50"
                                    }`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
