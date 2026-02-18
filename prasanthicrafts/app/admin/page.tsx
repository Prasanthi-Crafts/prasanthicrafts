"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Package, Tag, MessageSquare } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        products: 0,
        categories: 0,
        reviews: 0,
    });

    useEffect(() => {
        async function fetchStats() {
            const { count: productCount } = await supabase.from("products").select("*", { count: "exact" });
            const { count: categoryCount } = await supabase.from("categories").select("*", { count: "exact" });
            const { count: reviewCount } = await supabase.from("reviews").select("*", { count: "exact" });

            setStats({
                products: productCount || 0,
                categories: categoryCount || 0,
                reviews: reviewCount || 0,
            });
        }

        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Overview of your store</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
                            <Package className="w-6 h-6" strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Products</p>
                            <h3 className="text-3xl font-bold text-gray-900">{stats.products}</h3>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
                            <Tag className="w-6 h-6" strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Categories</p>
                            <h3 className="text-3xl font-bold text-gray-900">{stats.categories}</h3>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-50 text-yellow-500 rounded-xl">
                            <MessageSquare className="w-6 h-6" strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Reviews</p>
                            <h3 className="text-3xl font-bold text-gray-900">{stats.reviews}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
