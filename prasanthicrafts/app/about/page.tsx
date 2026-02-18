"use client";

import { Toaster } from "react-hot-toast";
import { CartProvider } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import ScrollToTop from "../components/ScrollToTop";
import { Heart, Award, Users, Sparkles } from "lucide-react";

export default function AboutPage() {
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
                    <div className="absolute top-1/4 left-10 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="max-w-screen-xl mx-auto px-4 text-center relative z-10">
                        <p className="text-sm font-semibold text-yellow-400 uppercase tracking-widest mb-3">Our Story</p>
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                            About <span className="text-yellow-400">Prasanthi Crafts</span>
                        </h1>
                        <p className="text-white/60 mt-4 text-lg max-w-2xl mx-auto">
                            A passion for handcrafted excellence, rooted in tradition and quality
                        </p>
                    </div>
                </div>

                {/* Our Story Section */}
                <section className="py-20">
                    <div className="max-w-screen-xl mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div>
                                <p className="text-sm font-semibold text-yellow-500 uppercase tracking-widest mb-3">Who We Are</p>
                                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
                                    Crafting Excellence Since Day One
                                </h2>
                                <div className="space-y-4 text-gray-600 leading-relaxed">
                                    <p>
                                        At Prasanthi Crafts, we believe in the beauty of handmade creations. Our journey began with a simple
                                        passion — to bring high-quality, artisanal craft supplies and products to creative minds across Sri Lanka
                                        and beyond.
                                    </p>
                                    <p>
                                        Every product in our collection is carefully selected and crafted to meet the highest standards of quality.
                                        From die-cut shapes to pipe cleaners, we provide the tools and materials that fuel creativity and
                                        bring ideas to life.
                                    </p>
                                    <p>
                                        We are more than just a store — we are a community of craft lovers who share a passion for creating
                                        something beautiful with our hands.
                                    </p>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-8 text-black">
                                    <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                                    <p className="text-black/80 leading-relaxed">
                                        To inspire creativity by providing premium, handcrafted materials and products that empower artisans,
                                        hobbyists, and craft enthusiasts to bring their visions to life with confidence and joy.
                                    </p>
                                </div>
                                <div className="absolute -bottom-4 -right-4 w-full h-full bg-gray-900 rounded-2xl -z-10"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-screen-xl mx-auto px-4">
                        <div className="text-center mb-14">
                            <p className="text-sm font-semibold text-yellow-500 uppercase tracking-widest mb-2">Our Values</p>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">What Drives Us</h2>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    icon: Heart,
                                    title: "Passion",
                                    desc: "Every product reflects our deep love for craftsmanship and creativity.",
                                    color: "bg-red-50 text-red-500",
                                },
                                {
                                    icon: Award,
                                    title: "Quality",
                                    desc: "We source only the finest materials to ensure premium quality in every item.",
                                    color: "bg-yellow-50 text-yellow-600",
                                },
                                {
                                    icon: Users,
                                    title: "Community",
                                    desc: "Building connections with craft lovers and supporting local artisans.",
                                    color: "bg-blue-50 text-blue-500",
                                },
                                {
                                    icon: Sparkles,
                                    title: "Innovation",
                                    desc: "Constantly exploring new materials and techniques to inspire our customers.",
                                    color: "bg-purple-50 text-purple-500",
                                },
                            ].map((value, index) => (
                                <div
                                    key={value.title}
                                    className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
                                >
                                    <div className={`w-14 h-14 rounded-xl ${value.color} flex items-center justify-center mx-auto mb-5`}>
                                        <value.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{value.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="py-20">
                    <div className="max-w-screen-xl mx-auto px-4">
                        <div className="text-center mb-14">
                            <p className="text-sm font-semibold text-yellow-500 uppercase tracking-widest mb-2">Why Us</p>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Why Choose Prasanthi Crafts</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    num: "01",
                                    title: "Handpicked Products",
                                    desc: "Every item in our store is carefully curated and quality-checked before being made available to you.",
                                },
                                {
                                    num: "02",
                                    title: "Fast & Reliable Shipping",
                                    desc: "We ensure your orders are packed with care and delivered to your doorstep quickly and safely.",
                                },
                                {
                                    num: "03",
                                    title: "Customer First",
                                    desc: "Your satisfaction is our priority. We offer responsive support and hassle-free returns.",
                                },
                            ].map((item) => (
                                <div key={item.num} className="group">
                                    <span className="text-5xl font-extrabold text-gray-100 group-hover:text-yellow-200 transition-colors">
                                        {item.num}
                                    </span>
                                    <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2">{item.title}</h3>
                                    <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
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
