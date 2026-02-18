"use client";

import { Toaster } from "react-hot-toast";
import { CartProvider } from "../context/CartContext";
import Navbar from "../components/Navbar";
import ProductSection from "../components/ProductSection";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import ScrollToTop from "../components/ScrollToTop";

export default function ProductsPage() {
    return (
        <CartProvider>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    style: {
                        background: "#1a1a1a",
                        color: "#fff",
                        borderRadius: "12px",
                        fontSize: "14px",
                    },
                }}
            />
            <main className="min-h-screen bg-white text-black">
                <Navbar />
                {/* Page Header */}
                <div className="pt-32 pb-12 bg-gradient-to-b from-gray-50 to-white">
                    <div className="max-w-screen-xl mx-auto px-4 text-center">
                        <p className="text-sm font-semibold text-yellow-500 uppercase tracking-widest mb-2">Our Collection</p>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">All Products</h1>
                        <p className="text-gray-400 mt-3 text-lg max-w-xl mx-auto">
                            Browse our full range of handcrafted products
                        </p>
                    </div>
                </div>
                <ProductSection />
                <Footer />
                <CartDrawer />
                <ScrollToTop />
            </main>
        </CartProvider>
    );
}
