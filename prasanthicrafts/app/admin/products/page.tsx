"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabaseClient";
import { CldUploadWidget } from 'next-cloudinary';
import toast, { Toaster } from "react-hot-toast";
import { Pencil, Trash2, LayoutGrid, X, Search, ChevronUp, ChevronDown, List, Grid3X3, ChevronLeft, ChevronRight, CheckSquare, Square } from "lucide-react";

type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    category_id: string;
    image_url: string | null;
    images: string[];
    categories?: { name: string; has_variations: boolean };
    product_variants?: ProductVariant[];
};

type Category = { id: string; name: string; has_variations: boolean };
type VariationType = { id: string; name: string; slug: string; display_order: number };
type ProductVariant = {
    id: string;
    product_id: string;
    variation_type_id: string;
    price: number;
    image_url: string | null;
    variation_types?: { name: string };
};

type SortField = "name" | "price" | "created_at" | "category";
type SortDirection = "asc" | "desc";

const ITEMS_PER_PAGE = 20;

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [variationTypes, setVariationTypes] = useState<VariationType[]>([]);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
    const [showVariantPanel, setShowVariantPanel] = useState<string | null>(null);
    const [variantForms, setVariantForms] = useState<Record<string, { price: string; image_url: string }>>({});
    const [showForm, setShowForm] = useState(false);
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<Omit<Product, 'id'>>();

    // Search, Sort, Filter, View, Pagination
    const [searchQuery, setSearchQuery] = useState("");
    const [sortField, setSortField] = useState<SortField>("name");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [viewMode, setViewMode] = useState<"grid" | "table">("table");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const watchedCategoryId = watch("category_id");

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchVariationTypes();
    }, []);

    useEffect(() => {
        setSelectedCategoryId(watchedCategoryId || "");
    }, [watchedCategoryId]);

    const selectedCategory = categories.find(c => c.id === selectedCategoryId);
    const categoryHasVariations = selectedCategory?.has_variations ?? false;

    // --- Filtering, Sorting, Pagination ---
    const processedProducts = useMemo(() => {
        let filtered = [...products];

        // Search
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.description?.toLowerCase().includes(q) ||
                p.categories?.name?.toLowerCase().includes(q)
            );
        }

        // Filter by category
        if (filterCategory !== "all") {
            filtered = filtered.filter(p => p.category_id === filterCategory);
        }

        // Sort
        filtered.sort((a, b) => {
            let cmp = 0;
            switch (sortField) {
                case "name":
                    cmp = a.name.localeCompare(b.name);
                    break;
                case "price":
                    cmp = Number(a.price) - Number(b.price);
                    break;
                case "category":
                    cmp = (a.categories?.name || "").localeCompare(b.categories?.name || "");
                    break;
                case "created_at":
                    cmp = 0; // already ordered by created_at from DB
                    break;
            }
            return sortDirection === "asc" ? cmp : -cmp;
        });

        return filtered;
    }, [products, searchQuery, filterCategory, sortField, sortDirection]);

    const totalPages = Math.ceil(processedProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = processedProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterCategory, sortField, sortDirection]);

    async function fetchProducts() {
        const { data } = await supabase
            .from("products")
            .select("*, categories(name, has_variations), product_variants(*, variation_types(name))")
            .order('created_at', { ascending: false });
        setProducts(data || []);
    }

    async function fetchCategories() {
        const { data } = await supabase.from("categories").select("*").order("name", { ascending: true });
        setCategories(data || []);
    }

    async function fetchVariationTypes() {
        const { data } = await supabase.from("variation_types").select("*").order('display_order', { ascending: true });
        setVariationTypes(data || []);
    }

    const onSubmit = async (data: any) => {
        try {
            const payload: any = {
                name: data.name,
                description: data.description,
                price: data.price,
                category_id: data.category_id || null,
                image_url: data.image_url,
            };

            if (isEditing) {
                const { error } = await supabase.from("products").update(payload).eq('id', isEditing);
                if (error) throw error;
                toast.success("Product updated");
            } else {
                const { error } = await supabase.from("products").insert([payload]);
                if (error) throw error;
                toast.success("Product created");
            }
            reset();
            setIsEditing(null);
            setSelectedCategoryId("");
            setShowForm(false);
            fetchProducts();
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        }
    };

    const handleEdit = (product: Product) => {
        setIsEditing(product.id);
        setValue("name", product.name);
        setValue("description", product.description);
        setValue("price", product.price);
        setValue("category_id", product.category_id);
        setValue("image_url", product.image_url);
        setSelectedCategoryId(product.category_id || "");
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) {
            toast.error("Failed to delete");
        } else {
            toast.success("Product deleted");
            setSelectedIds(prev => { const next = new Set(prev); next.delete(id); return next; });
            fetchProducts();
        }
    };

    // Bulk delete
    const handleBulkDelete = async () => {
        if (selectedIds.size === 0) return;
        if (!confirm(`Delete ${selectedIds.size} products? This cannot be undone.`)) return;
        const ids = Array.from(selectedIds);
        const { error } = await supabase.from("products").delete().in("id", ids);
        if (error) {
            toast.error("Failed to delete some products");
        } else {
            toast.success(`${ids.length} products deleted`);
            setSelectedIds(new Set());
            fetchProducts();
        }
    };

    // Selection helpers
    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        const pageIds = paginatedProducts.map(p => p.id);
        const allSelected = pageIds.every(id => selectedIds.has(id));
        if (allSelected) {
            setSelectedIds(prev => {
                const next = new Set(prev);
                pageIds.forEach(id => next.delete(id));
                return next;
            });
        } else {
            setSelectedIds(prev => {
                const next = new Set(prev);
                pageIds.forEach(id => next.add(id));
                return next;
            });
        }
    };

    // Sort toggle
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(prev => prev === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return <ChevronUp className="w-3 h-3 text-gray-300" />;
        return sortDirection === "asc"
            ? <ChevronUp className="w-3 h-3 text-yellow-500" />
            : <ChevronDown className="w-3 h-3 text-yellow-500" />;
    };

    // --- Variant Management ---
    const openVariantPanel = (product: Product) => {
        setShowVariantPanel(product.id);
        const forms: Record<string, { price: string; image_url: string }> = {};
        variationTypes.forEach(vt => {
            const existing = product.product_variants?.find(pv => pv.variation_type_id === vt.id);
            forms[vt.id] = {
                price: existing ? String(existing.price) : "",
                image_url: existing?.image_url || "",
            };
        });
        setVariantForms(forms);
    };

    const updateVariantForm = (vtId: string, field: string, value: string) => {
        setVariantForms(prev => ({
            ...prev,
            [vtId]: { ...prev[vtId], [field]: value },
        }));
    };

    const saveVariants = async (productId: string) => {
        try {
            await supabase.from("product_variants").delete().eq("product_id", productId);
            const inserts = Object.entries(variantForms)
                .filter(([, form]) => form.price !== "" && Number(form.price) > 0)
                .map(([vtId, form]) => ({
                    product_id: productId,
                    variation_type_id: vtId,
                    price: Number(form.price),
                    image_url: form.image_url || null,
                }));

            if (inserts.length > 0) {
                const { error } = await supabase.from("product_variants").insert(inserts);
                if (error) throw error;
            }

            toast.success("Variants saved!");
            setShowVariantPanel(null);
            fetchProducts();
        } catch (error: any) {
            toast.error(error.message || "Failed to save variants");
        }
    };

    return (
        <div className="space-y-6">
            <Toaster />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {products.length} total products · {processedProducts.length} showing
                    </p>
                </div>
                <button
                    onClick={() => { setShowForm(!showForm); if (showForm) { reset(); setIsEditing(null); setSelectedCategoryId(""); } }}
                    className="px-5 py-2.5 bg-black hover:bg-gray-800 text-white font-medium text-sm rounded-xl transition-colors flex items-center gap-2"
                >
                    {showForm ? <X className="w-4 h-4" /> : null}
                    {showForm ? "Close Form" : "+ Add Product"}
                </button>
            </div>

            {/* Add/Edit Form (collapsible) */}
            {showForm && (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-in slide-in-from-top-2">
                    <h2 className="text-lg font-semibold text-gray-900 mb-5">{isEditing ? "Edit Product" : "New Product"}</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                            <input
                                {...register("name", { required: "Name is required" })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-sm transition-all"
                                placeholder="Product Name"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                {categoryHasVariations ? "Base Price" : "Price"} (LKR) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                {...register("price", { required: true, min: 0 })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-sm transition-all"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                            <select
                                {...register("category_id")}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-sm transition-all bg-white"
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name} {cat.has_variations ? "(Variants)" : ""}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                            <textarea
                                {...register("description")}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-sm transition-all"
                                placeholder="Product description..."
                                rows={2}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Preview Image</label>
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

                        {categoryHasVariations && (
                            <div className="md:col-span-2 lg:col-span-3">
                                <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
                                    <p className="text-xs text-yellow-700">
                                        <span className="font-semibold">💡 Tip:</span> This category has material variations. After creating the product, click &quot;Manage Variants&quot; to set per-material pricing.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="md:col-span-2 lg:col-span-3 flex gap-2 pt-2">
                            <button
                                type="submit"
                                className="bg-black hover:bg-gray-800 text-white font-medium py-2.5 px-6 rounded-xl transition-colors text-sm"
                            >
                                {isEditing ? "Update Product" : "Create Product"}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={() => { reset(); setIsEditing(null); setSelectedCategoryId(""); }}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            {/* Toolbar: Search, Filter, Sort, View Toggle */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex flex-col md:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products by name, description, or category..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Category Filter */}
                    <select
                        value={filterCategory}
                        onChange={e => setFilterCategory(e.target.value)}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none bg-white min-w-[160px]"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    {/* Sort */}
                    <select
                        value={`${sortField}-${sortDirection}`}
                        onChange={e => {
                            const [f, d] = e.target.value.split("-") as [SortField, SortDirection];
                            setSortField(f);
                            setSortDirection(d);
                        }}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none bg-white min-w-[160px]"
                    >
                        <option value="name-asc">Name A→Z</option>
                        <option value="name-desc">Name Z→A</option>
                        <option value="price-asc">Price Low→High</option>
                        <option value="price-desc">Price High→Low</option>
                        <option value="category-asc">Category A→Z</option>
                        <option value="category-desc">Category Z→A</option>
                        <option value="created_at-desc">Newest First</option>
                        <option value="created_at-asc">Oldest First</option>
                    </select>

                    {/* View Toggle */}
                    <div className="flex bg-gray-100 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode("table")}
                            className={`p-2 rounded-lg transition-colors ${viewMode === "table" ? "bg-white shadow-sm text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
                            title="Table View"
                        >
                            <List className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white shadow-sm text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
                            title="Grid View"
                        >
                            <Grid3X3 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Bulk actions bar */}
                {selectedIds.size > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-3">
                        <span className="text-sm text-gray-600 font-medium">{selectedIds.size} selected</span>
                        <button
                            onClick={handleBulkDelete}
                            className="px-4 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors"
                        >
                            Delete Selected
                        </button>
                        <button
                            onClick={() => setSelectedIds(new Set())}
                            className="px-4 py-1.5 bg-gray-50 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Clear Selection
                        </button>
                    </div>
                )}
            </div>

            {/* Product List */}
            {processedProducts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <p className="text-gray-400">
                        {searchQuery || filterCategory !== "all"
                            ? "No products match your search or filter."
                            : "No products yet. Add one to get started."}
                    </p>
                </div>
            ) : viewMode === "table" ? (
                /* TABLE VIEW */
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-4 py-3 text-left w-10">
                                        <button onClick={toggleSelectAll} className="text-gray-400 hover:text-gray-600">
                                            {paginatedProducts.length > 0 && paginatedProducts.every(p => selectedIds.has(p.id))
                                                ? <CheckSquare className="w-4 h-4 text-yellow-500" />
                                                : <Square className="w-4 h-4" />}
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left w-16">Image</th>
                                    <th className="px-4 py-3 text-left">
                                        <button onClick={() => handleSort("name")} className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase hover:text-gray-900 transition-colors">
                                            Name <SortIcon field="name" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        <button onClick={() => handleSort("category")} className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase hover:text-gray-900 transition-colors">
                                            Category <SortIcon field="category" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        <button onClick={() => handleSort("price")} className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase hover:text-gray-900 transition-colors">
                                            Price <SortIcon field="price" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Variants</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedProducts.map((product) => {
                                    const hasVariations = product.categories?.has_variations ?? false;
                                    const variantCount = product.product_variants?.length || 0;
                                    const isSelected = selectedIds.has(product.id);

                                    return (
                                        <tr
                                            key={product.id}
                                            className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${isSelected ? "bg-yellow-50/50" : ""}`}
                                        >
                                            <td className="px-4 py-3">
                                                <button onClick={() => toggleSelect(product.id)} className="text-gray-400 hover:text-gray-600">
                                                    {isSelected
                                                        ? <CheckSquare className="w-4 h-4 text-yellow-500" />
                                                        : <Square className="w-4 h-4" />}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3">
                                                {product.image_url ? (
                                                    <img src={product.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-[10px]">N/A</div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                                                <p className="text-xs text-gray-400 truncate max-w-xs">{product.description}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                {product.categories?.name ? (
                                                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700">{product.categories.name}</span>
                                                ) : (
                                                    <span className="text-xs text-gray-400">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="font-semibold text-gray-900 text-sm">LKR {Number(product.price).toLocaleString()}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {hasVariations ? (
                                                    <button
                                                        onClick={() => openVariantPanel(product)}
                                                        className="text-xs font-semibold text-yellow-600 hover:text-yellow-700 transition-colors hover:underline"
                                                    >
                                                        {variantCount > 0 ? `${variantCount} variant${variantCount > 1 ? 's' : ''}` : 'Set up'}
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-gray-300">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* GRID VIEW */
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {paginatedProducts.map((product) => {
                        const hasVariations = product.categories?.has_variations ?? false;
                        const variantCount = product.product_variants?.length || 0;
                        const isSelected = selectedIds.has(product.id);

                        return (
                            <div key={product.id} className={`bg-white rounded-2xl border overflow-hidden hover:shadow-md transition-all ${isSelected ? "border-yellow-400 ring-1 ring-yellow-400" : "border-gray-100"}`}>
                                <div className="h-40 bg-gray-50 relative">
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No Image</div>
                                    )}
                                    <div className="absolute top-2 left-2">
                                        <button onClick={() => toggleSelect(product.id)} className="bg-white/90 backdrop-blur p-1.5 rounded-lg shadow-sm">
                                            {isSelected
                                                ? <CheckSquare className="w-4 h-4 text-yellow-500" />
                                                : <Square className="w-4 h-4 text-gray-400" />}
                                        </button>
                                    </div>
                                    <div className="absolute top-2 right-2 flex gap-1">
                                        <button onClick={() => handleEdit(product)} className="bg-white p-1.5 rounded-lg shadow-sm hover:bg-blue-50 transition-colors">
                                            <Pencil className="w-3 h-3" />
                                        </button>
                                        <button onClick={() => handleDelete(product.id)} className="bg-white p-1.5 rounded-lg shadow-sm hover:bg-red-50 transition-colors">
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                    {product.categories?.name && (
                                        <span className="absolute bottom-2 left-2 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">{product.categories.name}</span>
                                    )}
                                </div>
                                <div className="p-3">
                                    <h3 className="font-semibold text-gray-900 text-sm truncate">{product.name}</h3>
                                    <p className="text-xs text-gray-400 mt-0.5 truncate">{product.description}</p>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="font-bold text-gray-900 text-sm">LKR {Number(product.price).toLocaleString()}</span>
                                        {hasVariations && (
                                            <button
                                                onClick={() => openVariantPanel(product)}
                                                className="text-[10px] font-semibold text-yellow-600 hover:underline"
                                            >
                                                {variantCount > 0 ? `${variantCount} variants` : 'Set up'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 px-4 py-3">
                    <p className="text-sm text-gray-500">
                        Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, processedProducts.length)} of {processedProducts.length}
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                            let page: number;
                            if (totalPages <= 7) {
                                page = i + 1;
                            } else if (currentPage <= 4) {
                                page = i + 1;
                            } else if (currentPage >= totalPages - 3) {
                                page = totalPages - 6 + i;
                            } else {
                                page = currentPage - 3 + i;
                            }
                            return (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${currentPage === page ? "bg-yellow-400 text-black" : "hover:bg-gray-100 text-gray-600"}`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Variant Management Modal */}
            {showVariantPanel && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
                        onClick={() => setShowVariantPanel(null)}
                    />
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Manage Material Variants</h2>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {products.find(p => p.id === showVariantPanel)?.name} — Set price and image for each material
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowVariantPanel(null)}
                                    className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                {variationTypes.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400">
                                        <p>No material types created yet.</p>
                                        <p className="text-xs mt-1">Go to Material Types to add Foam Sheet, Mirror Board, etc.</p>
                                    </div>
                                ) : (
                                    variationTypes.map(vt => (
                                        <div key={vt.id} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600 font-bold text-xs">
                                                    {vt.name.charAt(0)}
                                                </div>
                                                <h3 className="font-semibold text-gray-900 text-sm">{vt.name}</h3>
                                                {variantForms[vt.id]?.price && Number(variantForms[vt.id].price) > 0 && (
                                                    <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium">Active</span>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Price (LKR)</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={variantForms[vt.id]?.price || ""}
                                                        onChange={e => updateVariantForm(vt.id, 'price', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Image</label>
                                                    <div className="flex gap-1">
                                                        <input
                                                            type="text"
                                                            value={variantForms[vt.id]?.image_url || ""}
                                                            onChange={e => updateVariantForm(vt.id, 'image_url', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-xs"
                                                            placeholder="URL"
                                                        />
                                                        <CldUploadWidget
                                                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                                            onSuccess={(result: any) => {
                                                                updateVariantForm(vt.id, 'image_url', result.info.secure_url);
                                                            }}
                                                        >
                                                            {({ open }) => (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => open()}
                                                                    className="px-2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-lg text-xs transition-colors flex-shrink-0"
                                                                    title="Upload image"
                                                                >
                                                                    📷
                                                                </button>
                                                            )}
                                                        </CldUploadWidget>
                                                    </div>
                                                </div>
                                            </div>
                                            {variantForms[vt.id]?.image_url && (
                                                <div className="mt-2">
                                                    <img
                                                        src={variantForms[vt.id].image_url}
                                                        alt={vt.name}
                                                        className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            {variationTypes.length > 0 && (
                                <div className="px-6 py-4 border-t border-gray-100 flex gap-3 sticky bottom-0 bg-white rounded-b-2xl">
                                    <button
                                        onClick={() => setShowVariantPanel(null)}
                                        className="flex-1 py-3 border border-gray-200 text-gray-600 font-medium text-sm rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => saveVariants(showVariantPanel)}
                                        className="flex-1 py-3 bg-black text-white font-medium text-sm rounded-xl hover:bg-gray-800 transition-colors"
                                    >
                                        Save Variants
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
