"use client";

import { CartProvider } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";

export default function CheckoutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CartProvider>
            <Navbar />
            <CartDrawer />
            {children}
            <Footer />
        </CartProvider>
    );
}
