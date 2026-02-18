"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "../context/CartContext";
import { Product } from "../types";
import SearchOverlay from "./SearchOverlay";
import ProductModal from "./ProductModal";
import {
    Menu,
    X,
    Search,
    Mail,
    Phone,
    ShoppingCart,
    ChevronRight,
    Package,
} from "lucide-react";

type Category = {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
};

export default function Navbar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isScrolled, setIsScrolled] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);
    const { cartCount, setIsCartOpen } = useCart();

    useEffect(() => {
        async function fetchCategories() {
            const { data } = await supabase.from("categories").select("*");
            setCategories(data || []);
        }
        fetchCategories();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close sidebar when clicking outside
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isSidebarOpen]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsSearchOpen(true);
        }
    };

    const navLinks = [
        { label: "Home", href: "/" },
        { label: "Categories", href: "/#categories" },
        { label: "Products", href: "/products" },
        { label: "Reviews", href: "/reviews" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
    ];

    return (
        <>
            {/* ===== FIXED NAVBAR WRAPPER ===== */}
            <header
                className={`fixed w-full z-50 top-0 start-0 transition-shadow duration-300 ${isScrolled ? "shadow-md" : ""}`}
            >

                {/* ===== MAIN NAVBAR BAR ===== */}
                <div className="bg-yellow-400 border-b border-yellow-500">
                    <div className="max-w-screen-xl mx-auto px-4 py-2.5">
                        <div className="flex items-center justify-between gap-3">

                            {/* LEFT: Hamburger + Logo */}
                            <div className="flex items-center gap-3 flex-shrink-0">
                                {/* Categories Hamburger */}
                                <button
                                    onClick={() => setIsSidebarOpen(true)}
                                    className="p-2 text-gray-900 hover:text-black hover:bg-yellow-300 rounded-lg transition-all duration-200"
                                    aria-label="Open categories"
                                    id="categories-hamburger"
                                >
                                    <Menu className="w-6 h-6" />
                                </button>

                                {/* Logo */}
                                <Link href="/" className="flex items-center flex-shrink-0">
                                    <Image
                                        src="/prasanthi-crafts-logo.png"
                                        alt="Prasanthi Crafts"
                                        width={160}
                                        height={45}
                                        className="h-10 sm:h-12 w-auto"
                                        priority
                                    />
                                </Link>
                            </div>

                            {/* CENTER: Search Bar (hidden on mobile, shown on md+) */}
                            <div className="hidden md:flex flex-1 max-w-lg mx-6">
                                <form onSubmit={handleSearchSubmit} className="w-full relative">
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => setIsSearchOpen(true)}
                                        placeholder="What are you looking for?"
                                        className="w-full pl-4 pr-12 py-2.5 bg-white border border-yellow-500 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-gray-900 hover:bg-black text-white rounded-md transition-colors"
                                    >
                                        <Search className="w-4 h-4" strokeWidth={2.5} />
                                    </button>
                                </form>
                            </div>

                            {/* RIGHT: Contact Info + Cart */}
                            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                                {/* Contact Info — hidden on small screens */}
                                <div className="hidden lg:flex items-center gap-5">
                                    {/* Email */}
                                    <a href="mailto:contact@prasanthicraftslk.com" className="flex items-center gap-2 text-gray-900 hover:text-black transition-colors group">
                                        <div className="p-1.5 bg-yellow-300 group-hover:bg-yellow-200 rounded-full transition-colors">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <div className="leading-tight">
                                            <p className="text-[10px] uppercase tracking-wider text-gray-800 font-semibold">Contact</p>
                                            <p className="text-xs font-bold text-gray-900">contact@prasanthicraftslk.com</p>
                                        </div>
                                    </a>

                                    {/* Phone */}
                                    <a href="tel:+94752455812" className="flex items-center gap-2 text-gray-900 hover:text-black transition-colors group">
                                        <div className="p-1.5 bg-yellow-300 group-hover:bg-yellow-200 rounded-full transition-colors">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <div className="leading-tight">
                                            <p className="text-[10px] uppercase tracking-wider text-gray-800 font-semibold">Need Support</p>
                                            <p className="text-xs font-bold text-gray-900">+9475 245 5812</p>
                                        </div>
                                    </a>
                                </div>

                                {/* Divider */}
                                <div className="hidden lg:block w-px h-8 bg-yellow-500" />

                                {/* Mobile Search Button */}
                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="md:hidden p-2 text-gray-900 hover:text-black hover:bg-yellow-300 rounded-lg transition-colors"
                                    aria-label="Search"
                                >
                                    <Search className="w-5 h-5" />
                                </button>

                                {/* Cart */}
                                <button
                                    onClick={() => setIsCartOpen(true)}
                                    className="relative p-2 text-gray-900 hover:text-black hover:bg-yellow-300 rounded-lg transition-colors"
                                    id="cart-button"
                                    aria-label="Open cart"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-black text-yellow-400 text-[10px] font-bold flex items-center justify-center animate-bounce-in">
                                            {cartCount > 99 ? "99+" : cartCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== BOTTOM NAVIGATION BAR ===== */}
                <div className="bg-black text-white">
                    <div className="max-w-screen-xl mx-auto px-4">
                        {/* Desktop nav links */}
                        <div className="hidden md:flex items-center justify-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="px-4 py-3 text-sm font-medium text-gray-300 hover:text-yellow-400 hover:bg-white/5 transition-all duration-200 uppercase tracking-wider"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Mobile: show condensed nav with hamburger toggle */}
                        <div className="md:hidden flex items-center justify-between py-2">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="flex items-center gap-2 text-sm text-gray-300 hover:text-yellow-400 transition-colors"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="w-5 h-5" />
                                ) : (
                                    <Menu className="w-5 h-5" />
                                )}
                                <span className="uppercase tracking-wider font-medium">Menu</span>
                            </button>

                            {/* Quick contact info on mobile nav bar */}
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                                <a href="tel:+94752455812" className="hover:text-yellow-400 transition-colors flex items-center gap-1">
                                    <Phone className="w-3.5 h-3.5" />
                                    Call Us
                                </a>
                            </div>
                        </div>

                        {/* Mobile dropdown menu */}
                        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? "max-h-96 opacity-100 pb-3" : "max-h-0 opacity-0"}`}>
                            <div className="border-t border-white/10 pt-2 space-y-0.5">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-3 py-2.5 text-sm font-medium text-gray-300 hover:text-yellow-400 hover:bg-white/5 rounded-lg transition-colors uppercase tracking-wider"
                                    >
                                        {link.label}
                                    </Link>
                                ))}

                                {/* Mobile contact details */}
                                <div className="border-t border-white/10 mt-2 pt-3 space-y-2 px-3">
                                    <a href="mailto:contact@prasanthicraftslk.com" className="flex items-center gap-2 text-xs text-gray-400 hover:text-yellow-400 transition-colors">
                                        <Mail className="w-4 h-4" />
                                        contact@prasanthicraftslk.com
                                    </a>
                                    <a href="tel:+94752455812" className="flex items-center gap-2 text-xs text-gray-400 hover:text-yellow-400 transition-colors">
                                        <Phone className="w-4 h-4" />
                                        +9475 245 5812
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ===== CATEGORIES SIDEBAR ===== */}
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar Panel */}
            <div
                className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-[70] transform transition-transform duration-300 ease-in-out shadow-2xl ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider">Categories</h2>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
                        aria-label="Close categories"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Sidebar Content */}
                <div className="overflow-y-auto h-[calc(100%-65px)]">
                    {categories.length === 0 ? (
                        <div className="p-6 text-center text-gray-400 text-sm">No categories yet</div>
                    ) : (
                        <div className="py-2">
                            {categories.map((cat, index) => (
                                <a
                                    key={cat.id}
                                    href={`/#category-${cat.slug}`}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="flex items-center gap-4 px-5 py-3.5 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-all duration-200 border-b border-gray-50 group"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {cat.image_url ? (
                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 ring-1 ring-gray-200 group-hover:ring-yellow-300 transition-all">
                                            <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 ring-1 ring-gray-200 group-hover:ring-yellow-300 transition-all">
                                            <Package className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate">{cat.name}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-yellow-500 transition-colors" />
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ===== SEARCH OVERLAY ===== */}
            <SearchOverlay
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onSelectProduct={(product) => setSelectedProduct(product)}
            />

            {/* ===== PRODUCT MODAL ===== */}
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
