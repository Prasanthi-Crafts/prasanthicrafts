"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Product, CartItem } from "../types";

type CartContextType = {
    items: CartItem[];
    addToCart: (product: Product, quantity?: number, variant?: CartItem['selectedVariant']) => void;
    removeFromCart: (cartKey: string) => void;
    updateQuantity: (cartKey: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "prasanthi-crafts-cart";

// Generate a unique key for each cart item (product + variant combo)
function getCartKey(productId: string, variantId?: string | null): string {
    return variantId ? `${productId}__${variantId}` : productId;
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            if (stored) {
                setItems(JSON.parse(stored));
            }
        } catch {
            // ignore parse errors
        }
        setIsInitialized(true);
    }, []);

    // Persist cart to localStorage on change
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, isInitialized]);

    const addToCart = useCallback((product: Product, quantity: number = 1, variant?: CartItem['selectedVariant']) => {
        setItems((prev) => {
            const cartKey = getCartKey(product.id, variant?.id);
            const existing = prev.find((item) =>
                getCartKey(item.product.id, item.selectedVariant?.id) === cartKey
            );
            if (existing) {
                return prev.map((item) =>
                    getCartKey(item.product.id, item.selectedVariant?.id) === cartKey
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { product, quantity, selectedVariant: variant || null }];
        });
        setIsCartOpen(true);
    }, []);

    const removeFromCart = useCallback((cartKey: string) => {
        setItems((prev) => prev.filter((item) =>
            getCartKey(item.product.id, item.selectedVariant?.id) !== cartKey
        ));
    }, []);

    const updateQuantity = useCallback((cartKey: string, quantity: number) => {
        if (quantity <= 0) {
            setItems((prev) => prev.filter((item) =>
                getCartKey(item.product.id, item.selectedVariant?.id) !== cartKey
            ));
            return;
        }
        setItems((prev) =>
            prev.map((item) =>
                getCartKey(item.product.id, item.selectedVariant?.id) === cartKey
                    ? { ...item, quantity }
                    : item
            )
        );
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = items.reduce(
        (sum, item) => {
            const price = item.selectedVariant ? item.selectedVariant.price : item.product.price;
            return sum + Number(price) * item.quantity;
        },
        0
    );

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartCount,
                cartTotal,
                isCartOpen,
                setIsCartOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export { getCartKey };

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
