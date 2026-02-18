"use client";

import { useCart, getCartKey } from "../context/CartContext";
import Link from "next/link";
import { ShoppingBag, X, Trash2, ImageIcon } from "lucide-react";

export default function CartDrawer() {
    const {
        items,
        removeFromCart,
        updateQuantity,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
    } = useCart();

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isCartOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-5 h-5 text-gray-900" />
                        <h2 className="text-lg font-bold text-gray-900">Shopping Cart</h2>
                        <span className="bg-yellow-400 text-black text-xs font-bold px-2.5 py-0.5 rounded-full">
                            {cartCount}
                        </span>
                    </div>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <ShoppingBag className="w-10 h-10 text-gray-300" strokeWidth={1.5} />
                            </div>
                            <p className="text-gray-900 font-semibold text-lg mb-1">Your cart is empty</p>
                            <p className="text-gray-400 text-sm">Add some beautiful crafts!</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="mt-6 px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => {
                                const cartKey = getCartKey(item.product.id, item.selectedVariant?.id);
                                const displayImage = item.selectedVariant?.image_url || item.product.image_url;

                                return (
                                    <div
                                        key={cartKey}
                                        className="flex gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors"
                                    >
                                        {/* Image */}
                                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                            {displayImage ? (
                                                <img
                                                    src={displayImage}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <ImageIcon className="w-8 h-8" strokeWidth={1} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 text-sm truncate">
                                                {item.product.name}
                                            </h3>
                                            {item.selectedVariant && (
                                                <p className="text-xs text-yellow-600 font-medium mt-0.5">
                                                    {item.selectedVariant.name}
                                                </p>
                                            )}

                                            {/* Quantity controls */}
                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    onClick={() => updateQuantity(cartKey, item.quantity - 1)}
                                                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-xs"
                                                >
                                                    −
                                                </button>
                                                <span className="text-sm font-semibold text-gray-900 w-6 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(cartKey, item.quantity + 1)}
                                                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-xs"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Remove */}
                                        <button
                                            onClick={() => removeFromCart(cartKey)}
                                            className="self-start p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-gray-100 px-6 py-5 space-y-4">
                        <p className="text-xs text-gray-400">Shipping calculated at checkout</p>
                        <Link
                            href="/checkout"
                            onClick={() => setIsCartOpen(false)}
                            className="block w-full text-center px-6 py-3.5 bg-yellow-400 text-black font-bold text-sm rounded-full hover:bg-yellow-500 transition-all duration-300 shadow-lg shadow-yellow-400/20"
                        >
                            Proceed to Checkout
                        </Link>
                        <button
                            onClick={() => setIsCartOpen(false)}
                            className="block w-full text-center px-6 py-2.5 text-gray-500 text-sm font-medium hover:text-gray-900 transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
