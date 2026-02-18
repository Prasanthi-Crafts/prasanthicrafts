"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabaseClient";
import { CldUploadWidget } from 'next-cloudinary';
import toast, { Toaster } from "react-hot-toast";
import { Search, X, ArrowUp, ArrowDown, GripVertical } from "lucide-react";

type Category = {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
    has_variations: boolean;
    display_order?: number;
};

type SortMode = "alpha-asc" | "alpha-desc" | "newest" | "oldest" | "custom";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [hasVariations, setHasVariations] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortMode, setSortMode] = useState<SortMode>("alpha-asc");
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<Omit<Category, 'id'>>();

    const nameValue = watch("name");

    useEffect(() => {
        fetchCategories();
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

    async function fetchCategories() {
        const { data, error } = await supabase.from("categories").select("*").order('name', { ascending: true });
        if (error) {
            toast.error("Failed to fetch categories");
        } else {
            setCategories(data || []);
        }
    }

    // Processed (searched + sorted) categories
    const processedCategories = useMemo(() => {
        let filtered = [...categories];

        // Search
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(c => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q));
        }

        // Sort
        switch (sortMode) {
            case "alpha-asc":
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "alpha-desc":
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "newest":
                filtered.reverse();
                break;
            case "oldest":
                break;
            case "custom":
                filtered.sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999));
                break;
        }

        return filtered;
    }, [categories, searchQuery, sortMode]);

    const onSubmit = async (data: any) => {
        try {
            const payload = {
                name: data.name,
                slug: data.slug,
                image_url: data.image_url,
                has_variations: hasVariations,
            };

            if (isEditing) {
                const { error } = await supabase
                    .from("categories")
                    .update(payload)
                    .eq('id', isEditing);
                if (error) throw error;
                toast.success("Category updated");
            } else {
                const { error } = await supabase.from("categories").insert([payload]);
                if (error) throw error;
                toast.success("Category created");
            }
            reset();
            setIsEditing(null);
            setHasVariations(true);
            fetchCategories();
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        }
    };

    const handleEdit = (category: Category) => {
        setIsEditing(category.id);
        setValue("name", category.name);
        setValue("slug", category.slug);
        setValue("image_url", category.image_url);
        setHasVariations(category.has_variations);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? Products in this category will lose their category assignment.")) return;
        const { error } = await supabase.from("categories").delete().eq("id", id);
        if (error) {
            toast.error("Failed to delete");
        } else {
            toast.success("Category deleted");
            fetchCategories();
        }
    };

    // Move category up/down in custom order
    const moveCategory = async (id: string, direction: "up" | "down") => {
        const idx = processedCategories.findIndex(c => c.id === id);
        if (direction === "up" && idx <= 0) return;
        if (direction === "down" && idx >= processedCategories.length - 1) return;

        const swapIdx = direction === "up" ? idx - 1 : idx + 1;
        const current = processedCategories[idx];
        const swap = processedCategories[swapIdx];

        const currentOrder = current.display_order ?? idx;
        const swapOrder = swap.display_order ?? swapIdx;

        await supabase.from("categories").update({ display_order: swapOrder }).eq("id", current.id);
        await supabase.from("categories").update({ display_order: currentOrder }).eq("id", swap.id);

        fetchCategories();
    };

    return (
        <div className="space-y-6">
            <Toaster />

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                <p className="text-sm text-gray-500 mt-1">
                    {categories.length} categories · Manage and organize your product categories
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
                    <h2 className="text-lg font-semibold text-gray-900 mb-5">{isEditing ? "Edit Category" : "New Category"}</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                            <input
                                {...register("name", { required: "Name is required" })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-sm transition-all"
                                placeholder="e.g. Home Decor"
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
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Image</label>
                            <div className="flex gap-2">
                                <input
                                    {...register("image_url")}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-sm transition-all"
                                    placeholder="Image URL"
                                />
                                <CldUploadWidget uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET} onSuccess={(result: any) => {
                                    setValue("image_url", result.info.secure_url);
                                }}>
                                    {({ open }) => (
                                        <button
                                            type="button"
                                            onClick={() => open()}
                                            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
                                        >
                                            Upload
                                        </button>
                                    )}
                                </CldUploadWidget>
                            </div>
                        </div>

                        {/* Has Variations Toggle */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Material Variations</label>
                                <p className="text-xs text-gray-400 mt-0.5">Products in this category have different material options</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setHasVariations(!hasVariations)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${hasVariations ? 'bg-yellow-400' : 'bg-gray-300'}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${hasVariations ? 'translate-x-6' : 'translate-x-1'}`}
                                />
                            </button>
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
                                    onClick={() => { reset(); setIsEditing(null); setHasVariations(true); }}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Search + Sort toolbar */}
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <select
                            value={sortMode}
                            onChange={e => setSortMode(e.target.value as SortMode)}
                            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none bg-white min-w-[160px]"
                        >
                            <option value="alpha-asc">A → Z</option>
                            <option value="alpha-desc">Z → A</option>
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="custom">Custom Order</option>
                        </select>
                    </div>

                    {/* Category List */}
                    {processedCategories.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                            <p className="text-gray-400">
                                {searchQuery ? "No categories match your search." : "No categories yet. Create one to get started."}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {processedCategories.map((cat, idx) => (
                                <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow group">
                                    {/* Reorder controls (only in custom sort) */}
                                    {sortMode === "custom" && (
                                        <div className="flex flex-col gap-0.5">
                                            <button
                                                onClick={() => moveCategory(cat.id, "up")}
                                                disabled={idx === 0}
                                                className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                                                title="Move up"
                                            >
                                                <ArrowUp className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => moveCategory(cat.id, "down")}
                                                disabled={idx === processedCategories.length - 1}
                                                className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                                                title="Move down"
                                            >
                                                <ArrowDown className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    )}

                                    {/* Number */}
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-bold flex-shrink-0">
                                        {idx + 1}
                                    </div>

                                    {/* Image */}
                                    {cat.image_url ? (
                                        <img src={cat.image_url} alt={cat.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                                    ) : (
                                        <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-xs flex-shrink-0">No img</div>
                                    )}

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-gray-900 text-sm">{cat.name}</h3>
                                            {cat.has_variations ? (
                                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 uppercase">Variants</span>
                                            ) : (
                                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 uppercase">Simple</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-0.5">/{cat.slug}</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(cat)} className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">Edit</button>
                                        <button onClick={() => handleDelete(cat.id)} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
