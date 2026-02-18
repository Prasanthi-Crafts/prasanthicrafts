"use client";

import { useState, useEffect } from "react";
import { Product, ProductVariant } from "../types";
import { useCart } from "../context/CartContext";
import { supabase } from "@/lib/supabaseClient";
import { X, ImageIcon, ShoppingBag, Check } from "lucide-react";

type Props = {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
};

export default function ProductModal({ product, isOpen, onClose }: Props) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [variants, setVariants] = useState<ProductVariant[]>([]);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [loadingVariants, setLoadingVariants] = useState(false);

    const hasVariations = product.categories?.has_variations ?? false;

    // Fetch variants when modal opens for a product with variations
    useEffect(() => {
        if (isOpen && hasVariations) {
            setLoadingVariants(true);
            supabase
                .from("product_variants")
                .select("*, variation_types(name, slug)")
                .eq("product_id", product.id)
                .order("created_at", { ascending: true })
                .then(({ data }) => {
                    const v = data || [];
                    setVariants(v);
                    // Auto-select first variant
                    if (v.length > 0) {
                        setSelectedVariant(v[0]);
                    }
                    setLoadingVariants(false);
                });
        } else {
            setVariants([]);
            setSelectedVariant(null);
        }
        setQuantity(1);
        setSelectedImage(0);
    }, [isOpen, product.id, hasVariations]);

    if (!isOpen) return null;

    // Build image list: preview image first, then variant images
    const allImages: { url: string; label?: string }[] = [];
    if (product.image_url) allImages.push({ url: product.image_url, label: "Preview" });

    if (hasVariations && variants.length > 0) {
        // Add variant images
        variants.forEach(v => {
            if (v.image_url) {
                allImages.push({
                    url: v.image_url,
                    label: v.variation_types?.name || "Variant",
                });
            }
        });
    } else {
        // Non-variant product: use additional images
        if (product.images) {
            product.images
                .filter((img) => img !== product.image_url)
                .forEach(img => allImages.push({ url: img }));
        }
    }

    // Current active price
    const activePrice = selectedVariant ? Number(selectedVariant.price) : Number(product.price);

    const handleVariantSelect = (variant: ProductVariant) => {
        setSelectedVariant(variant);
        // Switch to that variant's image if it exists
        if (variant.image_url) {
            const imgIndex = allImages.findIndex(img => img.url === variant.image_url);
            if (imgIndex >= 0) setSelectedImage(imgIndex);
        }
        setQuantity(1);
    };

    const handleAddToCart = () => {

        if (hasVariations && selectedVariant) {
            addToCart(product, quantity, {
                id: selectedVariant.id,
                name: selectedVariant.variation_types?.name || "Variant",
                price: Number(selectedVariant.price),
                image_url: selectedVariant.image_url,
            });
        } else {
            addToCart(product, quantity);
        }
        onClose();
        setQuantity(1);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
                <div
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-scale-in"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-gray-500 hover:text-gray-900 hover:bg-white transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Image Gallery */}
                        <div className="relative bg-gray-100 rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none overflow-hidden">
                            <div className="aspect-square flex items-center justify-center">
                                {allImages.length > 0 ? (
                                    <img
                                        src={allImages[selectedImage]?.url}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-gray-300">
                                        <ImageIcon className="w-24 h-24" strokeWidth={0.5} />
                                    </div>
                                )}
                            </div>

                            {/* Image label */}
                            {allImages.length > 0 && allImages[selectedImage]?.label && (
                                <div className="absolute top-4 right-4 bg-black/70 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                                    {allImages[selectedImage].label}
                                </div>
                            )}

                            {/* Thumbnails */}
                            {allImages.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                    {allImages.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${index === selectedImage
                                                ? "border-yellow-400 shadow-lg"
                                                : "border-white/50 opacity-70 hover:opacity-100"
                                                }`}
                                        >
                                            <img src={img.url} alt={img.label || ""} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {product.categories?.name && (
                                    <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                        {product.categories.name}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-8 flex flex-col">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                                {product.name}
                            </h2>


                            {product.description && (
                                <p className="mt-5 text-gray-500 leading-relaxed">
                                    {product.description}
                                </p>
                            )}

                            {/* Material Variant Selector */}
                            {hasVariations && (
                                <div className="mt-6">
                                    <span className="text-sm font-semibold text-gray-700 block mb-3">
                                        Select Material:
                                    </span>
                                    {loadingVariants ? (
                                        <div className="flex gap-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="h-10 w-24 bg-gray-100 animate-pulse rounded-full" />
                                            ))}
                                        </div>
                                    ) : variants.length === 0 ? (
                                        <p className="text-sm text-gray-400">No material variants available</p>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {variants.map(v => {
                                                const isSelected = selectedVariant?.id === v.id;
                                                return (
                                                    <button
                                                        key={v.id}
                                                        onClick={() => handleVariantSelect(v)}
                                                        className={`
                                                            relative px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border-2
                                                            ${isSelected
                                                                ? "border-yellow-400 bg-yellow-50 text-gray-900 shadow-md shadow-yellow-400/10"
                                                                : "border-gray-200 bg-white text-gray-700 hover:border-yellow-300 hover:bg-yellow-50"
                                                            }
                                                        `}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            {v.image_url && (
                                                                <img src={v.image_url} alt="" className="w-5 h-5 rounded-full object-cover" />
                                                            )}
                                                            {v.variation_types?.name}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Quantity + Add to Cart */}
                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-gray-700">Quantity:</span>
                                    <div className="flex items-center border border-gray-200 rounded-full">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-full transition-colors"
                                        >
                                            −
                                        </button>
                                        <span className="w-12 text-center font-semibold text-gray-900">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-full transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {hasVariations && !selectedVariant && variants.length > 0 ? (
                                    <button
                                        disabled
                                        className="w-full py-4 bg-gray-200 text-gray-400 font-bold text-sm rounded-full cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        Select a Material First
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleAddToCart}
                                        className="w-full py-4 bg-black text-white font-bold text-sm rounded-full hover:bg-yellow-500 hover:text-black transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        Add to Cart
                                    </button>
                                )}
                            </div>

                            {/* Features */}
                            <div className="mt-auto pt-8 border-t border-gray-100 grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Check className="w-4 h-4 text-yellow-500" />
                                    Handcrafted
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Check className="w-4 h-4 text-yellow-500" />
                                    Premium Quality
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Check className="w-4 h-4 text-yellow-500" />
                                    Secure Shipping
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Check className="w-4 h-4 text-yellow-500" />
                                    Quality Guaranteed
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
