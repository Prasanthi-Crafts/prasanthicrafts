-- Create the Categories Table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT,
  has_variations BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the Products Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  image_url TEXT,
  images TEXT[], -- Array of image URLs
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the Variation Types Table (e.g. Foam Sheet, Mirror Board, etc.)
CREATE TABLE variation_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the Product Variants Table
CREATE TABLE product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variation_type_id UUID REFERENCES variation_types(id) ON DELETE CASCADE,
  price NUMERIC(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, variation_type_id)
);

-- Create the Reviews Table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating SmallInt CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MIGRATION QUERIES (run these on existing database):
-- ============================================================

-- 1. Add has_variations column to categories
-- ALTER TABLE categories ADD COLUMN has_variations BOOLEAN DEFAULT true;

-- 2. Create variation_types table
-- CREATE TABLE variation_types (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   name TEXT NOT NULL UNIQUE,
--   slug TEXT NOT NULL UNIQUE,
--   display_order INT DEFAULT 0,
--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- 3. Create product_variants table
-- CREATE TABLE product_variants (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   product_id UUID REFERENCES products(id) ON DELETE CASCADE,
--   variation_type_id UUID REFERENCES variation_types(id) ON DELETE CASCADE,
--   price NUMERIC(10, 2) NOT NULL,
--   stock INT NOT NULL DEFAULT 0,
--   image_url TEXT,
--   created_at TIMESTAMPTZ DEFAULT NOW(),
--   UNIQUE(product_id, variation_type_id)
-- );
