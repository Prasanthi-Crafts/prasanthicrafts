"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Check } from "lucide-react";
import { useCart, getCartKey } from "../context/CartContext";

export default function CheckoutPage() {
    const { items, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
    const [step, setStep] = useState<"details" | "review" | "success">("details");
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        notes: "",
    });

    const shippingCost = cartTotal > 5000 ? 0 : 350;
    const total = cartTotal + shippingCost;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmitDetails = (e: React.FormEvent) => {
        e.preventDefault();
        setStep("review");
    };

    const handlePlaceOrder = () => {
        // In a real app, this would process the payment
        setStep("success");
        clearCart();
    };

    // Helper to get display price for an item
    const getItemPrice = (item: typeof items[0]) => {
        return item.selectedVariant ? Number(item.selectedVariant.price) : Number(item.product.price);
    };

    // Helper to get display image for an item
    const getItemImage = (item: typeof items[0]) => {
        return item.selectedVariant?.image_url || item.product.image_url;
    };

    if (items.length === 0 && step !== "success") {
        return (
            <main className="min-h-screen bg-gray-50 pt-24 pb-16">
                <div className="max-w-xl mx-auto px-4 text-center">
                    <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
                        <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-6">
                            <ShoppingBag className="w-10 h-10 text-gray-300" strokeWidth={1.5} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
                        <p className="text-gray-400 mb-8">Add some items before checking out</p>
                        <Link
                            href="/"
                            className="inline-block px-8 py-3 bg-black text-white font-semibold text-sm rounded-full hover:bg-gray-800 transition-colors"
                        >
                            Browse Products
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    if (step === "success") {
        return (
            <main className="min-h-screen bg-gray-50 pt-24 pb-16">
                <div className="max-w-xl mx-auto px-4 text-center">
                    <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
                        <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
                            <Check className="w-10 h-10 text-green-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed!</h1>
                        <p className="text-gray-500 mb-2">Thank you for your purchase</p>
                        <p className="text-sm text-gray-400 mb-8">We&apos;ll send you a confirmation email shortly with your order details.</p>
                        <Link
                            href="/"
                            className="inline-block px-8 py-3 bg-yellow-400 text-black font-bold text-sm rounded-full hover:bg-yellow-500 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
                    <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">Checkout</span>
                </div>

                {/* Steps indicator */}
                <div className="flex items-center justify-center gap-4 mb-12">
                    <div className={`flex items-center gap-2 ${step === "details" ? "text-yellow-600" : "text-gray-400"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === "details" ? "bg-yellow-400 text-black" : "bg-gray-200 text-gray-500"}`}>1</div>
                        <span className="text-sm font-medium hidden sm:inline">Details</span>
                    </div>
                    <div className="w-12 h-px bg-gray-200" />
                    <div className={`flex items-center gap-2 ${step === "review" ? "text-yellow-600" : "text-gray-400"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === "review" ? "bg-yellow-400 text-black" : "bg-gray-200 text-gray-500"}`}>2</div>
                        <span className="text-sm font-medium hidden sm:inline">Review & Pay</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left: Form or Review */}
                    <div className="lg:col-span-3">
                        {step === "details" && (
                            <form onSubmit={handleSubmitDetails} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Details</h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name *</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={form.firstName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name *</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={form.lastName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                                            placeholder="+94 77 123 4567"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Address *</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={form.address}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                                        placeholder="123 Main Street, Apartment 4"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={form.city}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                                            placeholder="Colombo"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Postal Code</label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={form.postalCode}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                                            placeholder="10100"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Order Notes (optional)</label>
                                    <textarea
                                        name="notes"
                                        value={form.notes}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all resize-none"
                                        placeholder="Any special instructions for your order..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full mt-6 py-4 bg-black text-white font-bold text-sm rounded-full hover:bg-gray-800 transition-colors"
                                >
                                    Continue to Review
                                </button>
                            </form>
                        )}

                        {step === "review" && (
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Review Your Order</h2>

                                {/* Shipping info summary */}
                                <div className="bg-gray-50 rounded-xl p-5 mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold text-gray-900 text-sm">Shipping To</h3>
                                        <button onClick={() => setStep("details")} className="text-xs text-yellow-600 font-semibold hover:underline">Edit</button>
                                    </div>
                                    <p className="text-sm text-gray-600">{form.firstName} {form.lastName}</p>
                                    <p className="text-sm text-gray-500">{form.address}</p>
                                    <p className="text-sm text-gray-500">{form.city} {form.postalCode}</p>
                                    <p className="text-sm text-gray-500">{form.email} · {form.phone}</p>
                                </div>

                                {/* Items */}
                                <div className="space-y-3">
                                    {items.map((item) => {
                                        const cartKey = getCartKey(item.product.id, item.selectedVariant?.id);
                                        const price = getItemPrice(item);
                                        const image = getItemImage(item);

                                        return (
                                            <div key={cartKey} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                                    {image ? (
                                                        <img src={image} alt={item.product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-900 text-sm truncate">{item.product.name}</p>
                                                    {item.selectedVariant && (
                                                        <p className="text-xs text-yellow-600 font-medium">{item.selectedVariant.name}</p>
                                                    )}
                                                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="font-bold text-gray-900 text-sm">LKR {(price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <button
                                        onClick={() => setStep("details")}
                                        className="flex-1 py-3.5 border border-gray-200 text-gray-700 font-semibold text-sm rounded-full hover:bg-gray-50 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handlePlaceOrder}
                                        className="flex-1 py-3.5 bg-yellow-400 text-black font-bold text-sm rounded-full hover:bg-yellow-500 transition-colors shadow-lg shadow-yellow-400/20"
                                    >
                                        Place Order
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                            <h3 className="font-bold text-gray-900 mb-5">Order Summary</h3>

                            <div className="space-y-3 max-h-60 overflow-y-auto">
                                {items.map((item) => {
                                    const cartKey = getCartKey(item.product.id, item.selectedVariant?.id);
                                    const price = getItemPrice(item);

                                    return (
                                        <div key={cartKey} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="text-gray-600 truncate">
                                                    {item.product.name}
                                                    {item.selectedVariant && (
                                                        <span className="text-yellow-600 ml-1">({item.selectedVariant.name})</span>
                                                    )}
                                                </span>
                                                <span className="text-gray-400">×{item.quantity}</span>
                                            </div>
                                            <span className="font-semibold text-gray-900 flex-shrink-0 ml-2">
                                                LKR {(price * item.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="border-t border-gray-100 mt-5 pt-5 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-semibold text-gray-900">LKR {cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className={`font-semibold ${shippingCost === 0 ? "text-green-600" : "text-gray-900"}`}>
                                        {shippingCost === 0 ? "Free" : `LKR ${shippingCost.toLocaleString()}`}
                                    </span>
                                </div>
                                {shippingCost > 0 && (
                                    <p className="text-xs text-gray-400">Free shipping on orders over LKR 5,000</p>
                                )}
                            </div>

                            <div className="border-t border-gray-100 mt-5 pt-5">
                                <div className="flex justify-between">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-extrabold text-gray-900">LKR {total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
