export type Category = {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
    has_variations: boolean;
    created_at?: string;
};

export type VariationType = {
    id: string;
    name: string;
    slug: string;
    display_order: number;
    created_at?: string;
};

export type ProductVariant = {
    id: string;
    product_id: string;
    variation_type_id: string;
    price: number;
    image_url: string | null;
    created_at?: string;
    variation_types?: { name: string; slug: string } | null;
};

export type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    category_id: string | null;
    image_url: string | null;
    images: string[] | null;
    created_at?: string;
    categories: { name: string; has_variations: boolean } | null;
    product_variants?: ProductVariant[];
};

export type CartItem = {
    product: Product;
    quantity: number;
    selectedVariant?: {
        id: string;
        name: string;
        price: number;
        image_url: string | null;
    } | null;
};

export type Review = {
    id: string;
    product_id: string;
    user_name: string;
    rating: number;
    comment: string;
    created_at?: string;
    products?: { name: string } | null;
};
