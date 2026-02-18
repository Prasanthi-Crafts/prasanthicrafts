"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabaseClient";
import toast, { Toaster } from "react-hot-toast";
import { Star } from "lucide-react";

type Review = {
    id: string;
    user_name: string;
    rating: number;
    comment: string;
    product_id: string;
    products?: { name: string };
};

type Product = { id: string; name: string; };

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        fetchReviews();
        fetchProducts();
    }, []);

    async function fetchReviews() {
        const { data } = await supabase.from("reviews").select("*, products(name)").order('created_at', { ascending: false });
        setReviews(data || []);
    }

    async function fetchProducts() {
        const { data } = await supabase.from("products").select("id, name");
        setProducts(data || []);
    }

    const onSubmit = async (data: any) => {
        const { error } = await supabase.from("reviews").insert([data]);
        if (error) {
            toast.error(error.message || "Failed to add review");
        } else {
            toast.success("Review added");
            reset();
            fetchReviews();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        const { error } = await supabase.from("reviews").delete().eq("id", id);
        if (error) {
            toast.error("Failed to delete");
        } else {
            toast.success("Review deleted");
            fetchReviews();
        }
    };

    return (
        <div className="space-y-8">
            <Toaster />
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
                <p className="text-sm text-gray-500 mt-1">Manage customer reviews</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
                    <h2 className="text-lg font-semibold text-gray-900 mb-5">Add Review</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Product</label>
                            <select
                                {...register("product_id", { required: true })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-sm transition-all bg-white"
                            >
                                <option value="">Select Product</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">User Name</label>
                            <input
                                {...register("user_name", { required: true })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-sm transition-all"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Rating (1-5)</label>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                {...register("rating", { required: true, min: 1, max: 5 })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-sm transition-all"
                                placeholder="5"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Comment</label>
                            <textarea
                                {...register("comment")}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-sm transition-all"
                                placeholder="Great product!"
                                rows={3}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
                        >
                            Add Review
                        </button>
                    </form>
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-2 space-y-3">
                    {reviews.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                            <p className="text-gray-400">No reviews yet.</p>
                        </div>
                    ) : reviews.map((review) => (
                        <div key={review.id} className="bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-sm transition-all">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-white font-bold text-sm">
                                        {review.user_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-sm">{review.user_name}</h3>
                                        <p className="text-xs text-gray-400">{review.products?.name || "Unknown product"}</p>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(review.id)} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                                    Delete
                                </button>
                            </div>
                            <div className="flex gap-0.5 mt-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-200 fill-current'}`} />
                                ))}
                            </div>
                            {review.comment && (
                                <p className="text-gray-600 text-sm mt-2 italic">&ldquo;{review.comment}&rdquo;</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
