"use client";

import { Toaster } from "react-hot-toast";
import { CartProvider } from "../context/CartContext";
import Navbar from "../components/Navbar";
import ReviewSection from "../components/ReviewSection";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import ScrollToTop from "../components/ScrollToTop";

export default function ReviewsPage() {
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
                        <p className="text-sm font-semibold text-yellow-500 uppercase tracking-widest mb-2">Testimonials</p>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Customer Reviews</h1>
                        <p className="text-gray-400 mt-3 text-lg max-w-xl mx-auto">
                            See what our customers have to say about our handcrafted products
                        </p>
                    </div>
                </div>
                <ReviewSection />
                <Footer />
                <CartDrawer />
                <ScrollToTop />
            </main>
        </CartProvider>
    );
}
