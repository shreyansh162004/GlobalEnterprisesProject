-- Global Enterprises Supabase Schema
-- Run these SQL commands in your Supabase dashboard

-- 1. Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  specs TEXT NOT NULL,
  description TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Brands Table
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Banner Table
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image TEXT NOT NULL,
  link TEXT,
  alt TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Contact Info Table
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  hours TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. WhatsApp Number Table
CREATE TABLE IF NOT EXISTS whatsapp_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Instagram Reels Table
CREATE TABLE IF NOT EXISTS instagram_reels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. YouTube Videos Table
CREATE TABLE IF NOT EXISTS youtube_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Channel Links Table
CREATE TABLE IF NOT EXISTS channel_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instagram TEXT,
  youtube TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Admin Credentials Table (Keep existing admin login - don't change)
CREATE TABLE IF NOT EXISTS admin_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL DEFAULT 'admin',
  password TEXT NOT NULL DEFAULT 'global2024',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_brands_name ON brands(name);

-- Insert default admin credentials (only if table is empty)
INSERT INTO admin_credentials (username, password)
SELECT 'admin', 'global2024'
WHERE NOT EXISTS (SELECT 1 FROM admin_credentials WHERE username = 'admin');

-- Insert single channel links record
INSERT INTO channel_links (instagram, youtube)
SELECT '', ''
WHERE NOT EXISTS (SELECT 1 FROM channel_links);

-- ---------------------------------------------------------------------------
-- Permissions for direct frontend access (anon key)
-- ---------------------------------------------------------------------------

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE, SELECT ON SEQUENCES TO anon, authenticated;

ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE brands DISABLE ROW LEVEL SECURITY;
ALTER TABLE banners DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_config DISABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_reels DISABLE ROW LEVEL SECURITY;
ALTER TABLE youtube_videos DISABLE ROW LEVEL SECURITY;
ALTER TABLE channel_links DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_credentials DISABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- RLS HOTFIX (idempotent): if RLS is enabled in your project, allow anon/app writes
-- ---------------------------------------------------------------------------

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE youtube_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS products_all_anon ON products;
DROP POLICY IF EXISTS categories_all_anon ON categories;
DROP POLICY IF EXISTS brands_all_anon ON brands;
DROP POLICY IF EXISTS banners_all_anon ON banners;
DROP POLICY IF EXISTS contact_info_all_anon ON contact_info;
DROP POLICY IF EXISTS whatsapp_config_all_anon ON whatsapp_config;
DROP POLICY IF EXISTS instagram_reels_all_anon ON instagram_reels;
DROP POLICY IF EXISTS youtube_videos_all_anon ON youtube_videos;
DROP POLICY IF EXISTS channel_links_all_anon ON channel_links;
DROP POLICY IF EXISTS admin_credentials_all_anon ON admin_credentials;

CREATE POLICY products_all_anon ON products FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY categories_all_anon ON categories FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY brands_all_anon ON brands FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY banners_all_anon ON banners FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY contact_info_all_anon ON contact_info FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY whatsapp_config_all_anon ON whatsapp_config FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY instagram_reels_all_anon ON instagram_reels FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY youtube_videos_all_anon ON youtube_videos FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY channel_links_all_anon ON channel_links FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY admin_credentials_all_anon ON admin_credentials FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- Supabase Storage bucket for product/banner images
-- ---------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ge-images',
  'ge-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "ge_images_public_read" ON storage.objects;
DROP POLICY IF EXISTS "ge_images_public_insert" ON storage.objects;
DROP POLICY IF EXISTS "ge_images_public_update" ON storage.objects;
DROP POLICY IF EXISTS "ge_images_public_delete" ON storage.objects;

CREATE POLICY "ge_images_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'ge-images');

CREATE POLICY "ge_images_public_insert"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'ge-images');

CREATE POLICY "ge_images_public_update"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'ge-images')
WITH CHECK (bucket_id = 'ge-images');

CREATE POLICY "ge_images_public_delete"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'ge-images');
