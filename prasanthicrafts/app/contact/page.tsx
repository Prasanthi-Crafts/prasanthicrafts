"use client";

import { useState } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { CartProvider } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import ScrollToTop from "../components/ScrollToTop";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1000));

        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setIsSubmitting(false);
    };

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

                {/* Hero Header */}
                <div className="pt-32 pb-16 bg-gradient-to-b from-gray-900 to-gray-800 text-white relative overflow-hidden">
                    <div className="absolute top-1/4 right-10 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-10 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="max-w-screen-xl mx-auto px-4 text-center relative z-10">
                        <p className="text-sm font-semibold text-yellow-400 uppercase tracking-widest mb-3">Get In Touch</p>
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                            Contact <span className="text-yellow-400">Us</span>
                        </h1>
                        <p className="text-white/60 mt-4 text-lg max-w-2xl mx-auto">
                            Have a question or need help? We&apos;d love to hear from you
                        </p>
                    </div>
                </div>

                {/* Contact Content */}
                <section className="py-20">
                    <div className="max-w-screen-xl mx-auto px-4">
                        <div className="grid lg:grid-cols-5 gap-12">
                            {/* Contact Info */}
                            <div className="lg:col-span-2 space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Let&apos;s Connect</h2>
                                    <p className="text-gray-500 leading-relaxed">
                                        Whether you have a question about our products, need help with an order, or just want to say hello —
                                        we&apos;re here for you.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4 group">
                                        <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-400 group-hover:text-black transition-all duration-300">
                                            <Mail className="w-5 h-5 text-yellow-600 group-hover:text-black transition-colors" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Email</h3>
                                            <a href="mailto:contact@prasanthicraftslk.com" className="text-gray-500 hover:text-yellow-600 transition-colors text-sm">
                                                contact@prasanthicraftslk.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 group">
                                        <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-400 group-hover:text-black transition-all duration-300">
                                            <Phone className="w-5 h-5 text-yellow-600 group-hover:text-black transition-colors" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Phone</h3>
                                            <a href="tel:+94752455812" className="text-gray-500 hover:text-yellow-600 transition-colors text-sm">
                                                +9475 245 5812
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 group">
                                        <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-400 group-hover:text-black transition-all duration-300">
                                            <MapPin className="w-5 h-5 text-yellow-600 group-hover:text-black transition-colors" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Location</h3>
                                            <p className="text-gray-500 text-sm">Gampaha, Sri Lanka</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 group">
                                        <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-400 group-hover:text-black transition-all duration-300">
                                            <Clock className="w-5 h-5 text-yellow-600 group-hover:text-black transition-colors" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Business Hours</h3>
                                            <p className="text-gray-500 text-sm">Mon – Sat: 9:00 AM – 6:00 PM</p>
                                            <p className="text-gray-400 text-xs mt-0.5">Sunday: Closed</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="lg:col-span-3">
                                <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-sm transition-all"
                                                    placeholder="Your name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-sm transition-all"
                                                    placeholder="your@email.com"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-sm transition-all"
                                                placeholder="How can we help?"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                                            <textarea
                                                required
                                                rows={5}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-sm transition-all resize-none"
                                                placeholder="Write your message..."
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-3.5 bg-black text-white font-semibold text-sm rounded-xl hover:bg-yellow-500 hover:text-black transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                "Sending..."
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    Send Message
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
                <CartDrawer />
                <ScrollToTop />
            </main>
        </CartProvider>
    );
}
