"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Product, Category } from "../types";
import { useCart } from "../context/CartContext";
import ProductModal from "./ProductModal";
import { ImageIcon, Plus } from "lucide-react";

export default function ProductSection() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const [productsRes, categoriesRes] = await Promise.all([
                supabase
                    .from("products")
                    .select("*, categories(name, has_variations), product_variants(*, variation_types(name, slug))")
                    .order("created_at", { ascending: false }),
                supabase.from("categories").select("*").order("name"),
            ]);
            setProducts(productsRes.data || []);
            setCategories(categoriesRes.data || []);
            setLoading(false);
        }
        fetchData();
    }, []);

    const filteredProducts =
        selectedCategory === "all"
            ? products
            : products.filter((p) => p.category_id === selectedCategory);

    if (loading) {
        return (
            <section className="py-20 bg-white" id="products">
                <div className="max-w-screen-xl mx-auto px-4">
                    <div className="text-center mb-14">
                        <p className="text-sm font-semibold text-yellow-500 uppercase tracking-widest mb-2">Our Store</p>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">Featured Products</h2>
                    </div>
                    {/* Skeleton grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="rounded-2xl overflow-hidden border border-gray-100">
                                <div className="h-64 bg-gray-100 animate-pulse" />
                                <div className="p-5 space-y-3">
                                    <div className="h-5 bg-gray-100 rounded-full animate-pulse w-3/4" />
                                    <div className="h-4 bg-gray-100 rounded-full animate-pulse w-full" />
                                    <div className="h-4 bg-gray-100 rounded-full animate-pulse w-1/2" />
                                    <div className="flex justify-between items-center pt-2">
                                        <div className="h-7 bg-gray-100 rounded-full animate-pulse w-24" />
                                        <div className="h-10 bg-gray-100 rounded-full animate-pulse w-28" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) {
        return (
            <section className="py-20 bg-white" id="products">
                <div className="max-w-screen-xl mx-auto px-4 text-center">
                    <p className="text-sm font-semibold text-yellow-500 uppercase tracking-widest mb-2">Our Store</p>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Featured Products</h2>
                    <p className="text-gray-400 text-lg">Products will appear here once added from the admin dashboard.</p>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="py-20 bg-white" id="products">
                <div className="max-w-screen-xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="text-sm font-semibold text-yellow-500 uppercase tracking-widest mb-2">Our Store</p>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">Featured Products</h2>
                    </div>

                    {/* Category filter tabs */}
                    {categories.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2 mb-12">
                            <button
                                onClick={() => setSelectedCategory("all")}
                                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${selectedCategory === "all"
                                    ? "bg-black text-white shadow-lg"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                All Products
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${selectedCategory === cat.id
                                        ? "bg-black text-white shadow-lg"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Products grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => {
                            const productHasVariations = product.categories?.has_variations && (product.product_variants?.length || 0) > 0;

                            return (
                                <div
                                    key={product.id}
                                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                                >
                                    {/* Product Image */}
                                    <div
                                        className="relative h-64 bg-gray-100 overflow-hidden cursor-pointer"
                                        onClick={() => setSelectedProduct(product)}
                                    >
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <ImageIcon className="w-16 h-16" strokeWidth={1} />
                                            </div>
                                        )}
                                        {/* Category badge */}
                                        {product.categories?.name && (
                                            <span className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                                {product.categories.name}
                                            </span>
                                        )}
                                        {/* Variants badge */}
                                        {productHasVariations && (
                                            <span className="absolute bottom-3 left-3 bg-black/70 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                                                {product.product_variants!.length} material{product.product_variants!.length > 1 ? 's' : ''}
                                            </span>
                                        )}
                                        {/* Quick view overlay */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-gray-900">
                                                Quick View
                                            </span>
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-5">
                                        <h3
                                            className="font-bold text-gray-900 text-lg truncate group-hover:text-yellow-600 transition-colors cursor-pointer"
                                            onClick={() => setSelectedProduct(product)}
                                        >
                                            {product.name}
                                        </h3>
                                        {product.description && (
                                            <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                                                {product.description}
                                            </p>
                                        )}
                                        <div className="mt-4 flex items-center justify-end">
                                            {productHasVariations ? (
                                                <button
                                                    onClick={() => setSelectedProduct(product)}
                                                    className="px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-full hover:bg-yellow-500 hover:text-black transition-all duration-300 flex items-center gap-1.5"
                                                >
                                                    Select
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => addToCart(product)}
                                                    className="px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-full hover:bg-yellow-500 hover:text-black transition-all duration-300 flex items-center gap-1.5"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Add
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Empty filter state */}
                    {filteredProducts.length === 0 && products.length > 0 && (
                        <div className="text-center py-16">
                            <p className="text-gray-400 text-lg">No products in this category yet.</p>
                            <button
                                onClick={() => setSelectedCategory("all")}
                                className="mt-4 text-yellow-600 font-semibold text-sm hover:underline"
                            >
                                Show all products
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Product Modal */}
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    isOpen={true}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </>
    );
}
