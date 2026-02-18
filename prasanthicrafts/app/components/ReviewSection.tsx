"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Review } from "../types";
import { Star } from "lucide-react";

export default function ReviewSection() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchReviews() {
            const { data } = await supabase
                .from("reviews")
                .select("*, products(name)")
                .order("created_at", { ascending: false })
                .limit(6);
            setReviews(data || []);
            setLoading(false);
        }
        fetchReviews();
    }, []);

    if (loading) {
        return (
            <section className="py-20 bg-gray-50" id="reviews">
                <div className="max-w-screen-xl mx-auto px-4">
                    <div className="text-center mb-14">
                        <p className="text-sm font-semibold text-yellow-500 uppercase tracking-widest mb-2">Testimonials</p>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">What Our Customers Say</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-7 border border-gray-100">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, j) => (
                                        <div key={j} className="w-5 h-5 rounded bg-gray-100 animate-pulse" />
                                    ))}
                                </div>
                                <div className="space-y-2 mb-5">
                                    <div className="h-4 bg-gray-100 rounded-full animate-pulse w-full" />
                                    <div className="h-4 bg-gray-100 rounded-full animate-pulse w-3/4" />
                                </div>
                                <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
                                    <div className="space-y-1.5">
                                        <div className="h-3 bg-gray-100 rounded-full animate-pulse w-20" />
                                        <div className="h-2.5 bg-gray-100 rounded-full animate-pulse w-28" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (reviews.length === 0) return null;

    return (
        <section className="py-20 bg-gray-50" id="reviews">
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="text-center mb-14">
                    <p className="text-sm font-semibold text-yellow-500 uppercase tracking-widest mb-2">Testimonials</p>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">What Our Customers Say</h2>
                    <p className="text-gray-400 mt-3 text-lg max-w-xl mx-auto">
                        Real reviews from our valued customers
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <div
                            key={review.id}
                            className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < review.rating
                                            ? "text-yellow-400 fill-current"
                                            : "text-gray-200 fill-current"
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Comment */}
                            <p className="text-gray-600 leading-relaxed mb-5 italic">
                                &ldquo;{review.comment}&rdquo;
                            </p>

                            {/* Reviewer */}
                            <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                    {review.user_name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">
                                        {review.user_name}
                                    </p>
                                    {review.products?.name && (
                                        <p className="text-xs text-gray-400">
                                            Purchased: {review.products.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
