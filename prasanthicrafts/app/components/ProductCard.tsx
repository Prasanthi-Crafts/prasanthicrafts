"use client";

import { useCart } from "../context/CartContext";
import { Product } from "../types";

type Props = {
    product: Product;
    onSelect?: (product: Product) => void;
};

export default function ProductCard({ product, onSelect }: Props) {
    const { addToCart } = useCart();

    const hasVariations = product.categories?.has_variations ?? false;
    const variants = product.product_variants || [];
    const hasVariants = hasVariations && variants.length > 0;

    // Get display price
    const getDisplayPrice = () => {
        if (hasVariants) {
            const prices = variants.map(v => Number(v.price));
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            if (min === max) return `LKR ${min.toLocaleString()}`;
            return `LKR ${min.toLocaleString()} – ${max.toLocaleString()}`;
        }
        return `LKR ${Number(product.price).toLocaleString()}`;
    };

    const handleAction = () => {
        if (hasVariants && onSelect) {
            onSelect(product);
        } else {
            addToCart(product);
        }
    };

    return (
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <div
                className="block relative h-64 overflow-hidden rounded-t-lg bg-gray-100 group cursor-pointer"
                onClick={() => onSelect?.(product)}
            >
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200 group-hover:bg-gray-300 transition-colors">
                        <span className="text-lg font-medium">{product.name}</span>
                    </div>
                )}
                {hasVariants && (
                    <span className="absolute bottom-3 left-3 bg-black/70 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                        {variants.length} material{variants.length > 1 ? 's' : ''}
                    </span>
                )}
            </div>
            <div className="px-5 py-5">
                <div className="flex items-center justify-between mb-2">
                    {product.categories?.name && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded uppercase">
                            {product.categories.name}
                        </span>
                    )}
                </div>
                <h5 className="text-xl font-semibold tracking-tight text-gray-900 mb-2 truncate">
                    {product.name}
                </h5>
                <div className="flex items-center justify-between mt-4">
                    <span className={`font-bold text-gray-900 ${hasVariants ? 'text-lg' : 'text-2xl'}`}>
                        {getDisplayPrice()}
                    </span>
                    <button
                        onClick={handleAction}
                        className="text-white bg-black hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors duration-300"
                    >
                        {hasVariants ? "Select" : "Add to cart"}
                    </button>
                </div>
            </div>
        </div>
    );
}
