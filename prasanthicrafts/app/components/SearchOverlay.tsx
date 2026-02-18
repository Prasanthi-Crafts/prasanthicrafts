"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Product } from "../types";
import { Search, ChevronRight } from "lucide-react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSelectProduct: (product: Product) => void;
};

export default function SearchOverlay({ isOpen, onClose, onSelectProduct }: Props) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            setQuery("");
            setResults([]);
        }
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
            return () => window.removeEventListener("keydown", handleKeyDown);
        }
    }, [isOpen, onClose]);

    const searchProducts = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }
        setLoading(true);
        const { data } = await supabase
            .from("products")
            .select("*, categories(name, has_variations), product_variants(*, variation_types(name, slug))")
            .ilike("name", `%${searchQuery}%`)
            .limit(10);
        setResults(data || []);
        setLoading(false);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => searchProducts(value), 300);
    };

    const handleSelect = (product: Product) => {
        onSelectProduct(product);
        onClose();
    };

    // Helper: get display price
    const getDisplayPrice = (product: Product) => {
        const hasVariations = product.categories?.has_variations ?? false;
        const variants = product.product_variants || [];

        if (hasVariations && variants.length > 0) {
            const prices = variants.map(v => Number(v.price));
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            if (min === max) return `LKR ${min.toLocaleString()}`;
            return `LKR ${min.toLocaleString()} – ${max.toLocaleString()}`;
        }
        return `LKR ${Number(product.price).toLocaleString()}`;
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-fade-in"
                onClick={onClose}
            />

            {/* Search Panel */}
            <div className="fixed inset-x-0 top-0 z-[110] px-4 pt-20 pb-8 flex justify-center">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-slide-down">
                    {/* Search Input */}
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                        <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <input
                            ref={inputRef}
                            value={query}
                            onChange={handleInputChange}
                            placeholder="Search products..."
                            className="w-full text-gray-900 placeholder-gray-400 outline-none text-sm bg-transparent"
                        />
                        <button
                            onClick={onClose}
                            className="text-xs text-gray-400 border border-gray-200 rounded px-2 py-1 flex-shrink-0 hover:bg-gray-50"
                        >
                            ESC
                        </button>
                    </div>

                    {/* Results */}
                    <div className="max-h-[400px] overflow-y-auto">
                        {loading && (
                            <div className="p-6 text-center">
                                <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-yellow-400 rounded-full animate-spin" />
                            </div>
                        )}

                        {!loading && query && results.length === 0 && (
                            <div className="p-6 text-center text-gray-400 text-sm">
                                No products found for &quot;{query}&quot;
                            </div>
                        )}

                        {!loading && results.length > 0 && (
                            <div className="py-2">
                                {results.map((product) => {
                                    const hasVars = product.categories?.has_variations && (product.product_variants?.length || 0) > 0;

                                    return (
                                        <button
                                            key={product.id}
                                            onClick={() => handleSelect(product)}
                                            className="w-full flex items-center gap-3 px-5 py-3 hover:bg-yellow-50 transition-colors text-left"
                                        >
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                {product.image_url ? (
                                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">—</div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold text-gray-900 truncate">
                                                    {product.name}
                                                </h4>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {product.categories?.name || "Uncategorized"} · {getDisplayPrice(product)}
                                                    {hasVars && (
                                                        <span className="ml-1.5 text-yellow-600">
                                                            · {product.product_variants!.length} material{product.product_variants!.length > 1 ? 's' : ''}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-300" />
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {!loading && !query && (
                            <div className="p-6 text-center text-gray-400 text-sm">
                                Start typing to search products...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
