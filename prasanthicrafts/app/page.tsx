"use client";

import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartContext";
import MaintenancePage from "./components/MaintenancePage";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CategorySection from "./components/CategorySection";
import ReviewSection from "./components/ReviewSection";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import ScrollToTop from "./components/ScrollToTop";

export default function Home() {
  // Set this to true to show the maintenance page
  const isUnderMaintenance = true;

  if (isUnderMaintenance) {
    return <MaintenancePage />;
  }

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
        <Hero />
        <CategorySection />
        <ReviewSection />
        <Footer />
        <CartDrawer />
        <ScrollToTop />
      </main>
    </CartProvider>
  );
}
