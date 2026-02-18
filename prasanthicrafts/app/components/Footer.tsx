"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
    Package,
    ShieldCheck,
    RefreshCw,
    LifeBuoy,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Instagram,
    Twitter,
} from "lucide-react";

export default function Footer() {
    const [email, setEmail] = useState("");

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            toast.success("Thank you for subscribing!");
            setEmail("");
        }
    };

    return (
        <footer className="bg-black text-white">
            {/* Trust badges */}
            <div className="border-b border-gray-800">
                <div className="max-w-screen-xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                            <Package className="w-6 h-6 text-yellow-400" strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-white">Free Shipping</p>
                            <p className="text-xs text-gray-400">On orders over LKR 5,000</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                            <ShieldCheck className="w-6 h-6 text-yellow-400" strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-white">Secure Payment</p>
                            <p className="text-xs text-gray-400">100% secure checkout</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                            <RefreshCw className="w-6 h-6 text-yellow-400" strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-white">Easy Returns</p>
                            <p className="text-xs text-gray-400">7-day return policy</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                            <LifeBuoy className="w-6 h-6 text-yellow-400" strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-white">24/7 Support</p>
                            <p className="text-xs text-gray-400">We&apos;re here to help</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="max-w-screen-xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div className="md:col-span-1">
                        <Link href="/" className="text-2xl font-bold tracking-tight">
                            Prasanthi<span className="text-yellow-400">Crafts</span>
                        </Link>
                        <p className="text-gray-400 text-sm mt-4 leading-relaxed">
                            Handcrafted with love and dedication. Each piece tells a story of tradition, artistry, and quality.
                        </p>
                        {/* Social icons */}
                        <div className="flex gap-3 mt-6">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-yellow-400 hover:text-black transition-all duration-300">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-yellow-400 hover:text-black transition-all duration-300">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-yellow-400 hover:text-black transition-all duration-300">
                                <Twitter className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Quick Links</h4>
                        <ul className="space-y-3">
                            <li><Link href="/" className="text-gray-300 hover:text-yellow-400 text-sm transition-colors">Home</Link></li>
                            <li><Link href="/products" className="text-gray-300 hover:text-yellow-400 text-sm transition-colors">Products</Link></li>
                            <li><Link href="/#categories" className="text-gray-300 hover:text-yellow-400 text-sm transition-colors">Categories</Link></li>
                            <li><Link href="/reviews" className="text-gray-300 hover:text-yellow-400 text-sm transition-colors">Reviews</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Support</h4>
                        <ul className="space-y-3">
                            <li><Link href="/contact" className="text-gray-300 hover:text-yellow-400 text-sm transition-colors">Contact Us</Link></li>
                            <li><Link href="/about" className="text-gray-300 hover:text-yellow-400 text-sm transition-colors">About Us</Link></li>
                            <li><a href="#" className="text-gray-300 hover:text-yellow-400 text-sm transition-colors">Shipping Info</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-yellow-400 text-sm transition-colors">Returns</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Contact</h4>
                        <ul className="space-y-3">
                            <li className="text-gray-300 text-sm flex items-start gap-2">
                                <Mail className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                                contact@prasanthicraftslk.com
                            </li>
                            <li className="text-gray-300 text-sm flex items-start gap-2">
                                <Phone className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                                +9475 245 5812
                            </li>
                            <li className="text-gray-300 text-sm flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                                Gampaha, Sri Lanka
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-sm">
                        © 2026 Prasanthi Crafts. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-500 hover:text-yellow-400 text-sm transition-colors">Privacy Policy</a>
                        <a href="#" className="text-gray-500 hover:text-yellow-400 text-sm transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
