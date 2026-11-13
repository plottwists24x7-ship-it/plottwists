-- ========================================================================
-- PLOTTWIST BAKERY: SUPABASE SECURITY HARDENING & RLS POLICY SCRIPT
-- Execute this script in your Supabase Dashboard SQL Editor to enforce
-- strict Row Level Security (RLS) across all tables and storage objects.
--
-- Security model:
-- 1. Anonymous visitors: SELECT (read-only) on public website tables
-- 2. Administrative mutations (INSERT, UPDATE, DELETE): Require valid
--    authenticated administrator session or server-side service role.
-- 3. Supabase Storage bucket 'products': Public read, authenticated upload.
-- ========================================================================

-- 1. ENABLE ROW LEVEL SECURITY ACROSS ALL MODULE TABLES
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.site_hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.site_instagram ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.story_images ENABLE ROW LEVEL SECURITY;

-- 2. CLEAN UP ANY PERMISSIVE ANONYMOUS WRITE POLICIES
DROP POLICY IF EXISTS "Enable insert for all users" ON public.products;
DROP POLICY IF EXISTS "Enable update for all users" ON public.products;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.products;

DROP POLICY IF EXISTS "Enable insert for all users" ON public.gallery_images;
DROP POLICY IF EXISTS "Enable update for all users" ON public.gallery_images;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.gallery_images;

DROP POLICY IF EXISTS "Enable insert for all users" ON public.reviews;
DROP POLICY IF EXISTS "Enable update for all users" ON public.reviews;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.reviews;

DROP POLICY IF EXISTS "Enable update for all users" ON public.site_hero;
DROP POLICY IF EXISTS "Enable update for all users" ON public.site_instagram;
DROP POLICY IF EXISTS "Enable update for all users" ON public.story_images;

-- 3. PUBLIC SELECT (READ-ONLY) POLICIES FOR STOREFRONT
CREATE POLICY "Public read products"
  ON public.products FOR SELECT
  TO public USING (true);

CREATE POLICY "Public read gallery_images"
  ON public.gallery_images FOR SELECT
  TO public USING (true);

CREATE POLICY "Public read reviews"
  ON public.reviews FOR SELECT
  TO public USING (true);

CREATE POLICY "Public read site_hero"
  ON public.site_hero FOR SELECT
  TO public USING (true);

CREATE POLICY "Public read site_instagram"
  ON public.site_instagram FOR SELECT
  TO public USING (true);

CREATE POLICY "Public read story_images"
  ON public.story_images FOR SELECT
  TO public USING (true);

-- 4. AUTHENTICATED ADMINISTRATOR WRITE POLICIES
CREATE POLICY "Admin manage products"
  ON public.products FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin manage gallery_images"
  ON public.gallery_images FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin manage reviews"
  ON public.reviews FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin manage site_hero"
  ON public.site_hero FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin manage site_instagram"
  ON public.site_instagram FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin manage story_images"
  ON public.story_images FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- 5. SUPABASE STORAGE POLICIES FOR BUCKET 'products'
-- Ensure bucket exists and is marked public for CDN asset delivery
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow public read access on bucket objects
CREATE POLICY "Public read products bucket"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'products');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated upload products bucket"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'products');

-- Allow authenticated users to update/replace images
CREATE POLICY "Authenticated update products bucket"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'products')
  WITH CHECK (bucket_id = 'products');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated delete products bucket"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'products');

