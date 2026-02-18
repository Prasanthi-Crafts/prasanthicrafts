"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Category } from "../types";
import { ChevronRight } from "lucide-react";

export default function CategorySection() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCategories() {
            const { data } = await supabase
                .from("categories")
                .select("*")
                .order("name", { ascending: true });
            setCategories(data || []);
            setLoading(false);
        }
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <section className="py-10 bg-gray-50" id="categories">
                <div className="max-w-screen-xl mx-auto px-4">
                    <div className="text-center mb-14">
                        <p className="text-sm font-semibold text-yellow-500 uppercase tracking-widest mb-2">Browse</p>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">Shop by Category</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-52 md:h-64 rounded-2xl bg-gray-200 animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (categories.length === 0) return null;

    return (
        <section className="py-10 bg-gray-50" id="categories">
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="text-center mb-14">
                    <p className="text-sm font-semibold text-yellow-500 uppercase tracking-widest mb-2">Browse</p>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">Shop by Category</h2>
                    <p className="text-gray-400 mt-3 text-lg max-w-xl mx-auto">
                        Explore our handcrafted collections, each made with care and tradition
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.map((category, index) => (
                        <a
                            key={category.id}
                            href="#products"
                            id={`category-${category.slug}`}
                            className="group relative h-52 md:h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 animate-slide-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Background */}
                            {category.image_url ? (
                                <img
                                    src={category.image_url}
                                    alt={category.name}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>
                            )}

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors duration-300"></div>

                            {/* Label */}
                            <div className="absolute inset-0 flex items-end p-5">
                                <div>
                                    <h3 className="text-white font-bold text-lg md:text-xl group-hover:text-yellow-300 transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-white/60 text-xs mt-1 group-hover:text-white/80 transition-colors flex items-center gap-1">
                                        Explore Collection
                                        <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                    </p>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
