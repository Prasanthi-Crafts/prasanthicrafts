"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabaseClient";
import toast, { Toaster } from "react-hot-toast";

type VariationType = {
    id: string;
    name: string;
    slug: string;
    display_order: number;
};

export default function VariationsPage() {
    const [variations, setVariations] = useState<VariationType[]>([]);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<Omit<VariationType, 'id'>>();

    const nameValue = watch("name");

    useEffect(() => {
        fetchVariations();
    }, []);

    // Auto-generate slug from name
    useEffect(() => {
        if (nameValue && !isEditing) {
            const slug = nameValue
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            setValue("slug", slug);
        }
    }, [nameValue, isEditing, setValue]);

    async function fetchVariations() {
        const { data, error } = await supabase
            .from("variation_types")
            .select("*")
            .order('display_order', { ascending: true });
        if (error) {
            toast.error("Failed to fetch variations");
        } else {
            setVariations(data || []);
        }
    }

    const onSubmit = async (data: any) => {
        try {
            const payload = {
                name: data.name,
                slug: data.slug,
                display_order: Number(data.display_order) || 0,
            };

            if (isEditing) {
                const { error } = await supabase
                    .from("variation_types")
                    .update(payload)
                    .eq('id', isEditing);
                if (error) throw error;
                toast.success("Variation type updated");
            } else {
                const { error } = await supabase.from("variation_types").insert([payload]);
                if (error) throw error;
                toast.success("Variation type created");
            }
            reset();
            setIsEditing(null);
            fetchVariations();
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        }
    };

    const handleEdit = (variation: VariationType) => {
        setIsEditing(variation.id);
        setValue("name", variation.name);
        setValue("slug", variation.slug);
        setValue("display_order", variation.display_order);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("This will remove this material type from all products. Are you sure?")) return;
        const { error } = await supabase.from("variation_types").delete().eq("id", id);
        if (error) {
            toast.error("Failed to delete");
        } else {
            toast.success("Variation type deleted");
            fetchVariations();
        }
    };

    return (
        <div className="space-y-8">
            <Toaster />
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Material Types</h1>
                <p className="text-sm text-gray-500 mt-1">Manage material variation types (e.g. Foam Sheet, Mirror Board, etc.)</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
                    <h2 className="text-lg font-semibold text-gray-900 mb-5">{isEditing ? "Edit Material" : "New Material"}</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                            <input
                                {...register("name", { required: "Name is required" })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-sm transition-all"
                                placeholder="e.g. Foam Sheet"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
                            <input
                                {...register("slug", { required: "Slug is required" })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-sm bg-gray-50 transition-all"
                                placeholder="auto-generated"
                            />
                            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message as string}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Order</label>
                            <input
                                type="number"
                                {...register("display_order")}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-sm transition-all"
                                placeholder="0"
                            />
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button
                                type="submit"
                                className="flex-1 bg-black hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
                            >
                                {isEditing ? "Update" : "Create"}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={() => { reset(); setIsEditing(null); }}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* List */}
                <div className="lg:col-span-2 space-y-3">
                    {variations.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                            <p className="text-gray-400">No material types yet. Create one to get started.</p>
                            <p className="text-xs text-gray-300 mt-2">e.g. Foam Sheet, Mirror Board, Shine Board, Color Board</p>
                        </div>
                    ) : variations.map((v) => (
                        <div key={v.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                            <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600 font-bold text-sm">
                                {v.display_order}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 text-sm">{v.name}</h3>
                                <p className="text-xs text-gray-400 mt-0.5">/{v.slug}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(v)} className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">Edit</button>
                                <button onClick={() => handleDelete(v.id)} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
