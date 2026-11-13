-- ========================================================================
-- PLOTTWIST BAKERY: CORRECTED SUPABASE SECURITY & RLS POLICY CONTRACT
-- File: scripts/supabase-security-corrected.sql
-- ========================================================================
-- ARCHITECTURAL NOTICE & THREAT MODEL ANALYSIS:
--
-- 1. OUR APPLICATION AUTHENTICATION MODEL:
--    PlotTwist Bakery authenticates administrators using custom HMAC-SHA256
--    session tokens stored in HTTP-only cookies ('admin_session').
--    This authentication is verified entirely on the Next.js server runtime
--    via Node.js crypto.
--
-- 2. WHY PREVIOUS RLS POLICIES (TO authenticated) WERE FLAWED:
--    - The custom HMAC cookie is NOT visible to PostgreSQL / Supabase PostgREST.
--    - Browser requests made with createBrowserClient(url, anonKey) operate
--      with role = 'anon' in PostgreSQL, NOT 'authenticated'.
--    - Granting INSERT/UPDATE/DELETE 'TO authenticated' would DENY the legitimate
--      admin (breaking CMS writes from the browser) while ACCIDENTALLY granting
--      write access to any third-party user who authenticates via Supabase Auth
--      (if user registration is enabled on the project).
--
-- 3. CORRECT TARGET AUTHORIZATION ARCHITECTURE:
--    - Public reads (SELECT) on all storefront tables are permitted for 'anon'
--      and 'authenticated' roles.
--    - Administrative writes (INSERT, UPDATE, DELETE) are RESTRICTED to 'service_role'.
--    - Administrative mutations must be executed through protected Next.js
--      server-side endpoints (/api/admin/*) that verify the HMAC session cookie
--      and execute database mutations using the server-side service role key.
--    - Storage bucket uploads must likewise be authenticated at the server layer.
--
-- 4. EXECUTION PRECONDITIONS & RISKS:
--    [WARNING]: Once this script is executed, any direct browser-side mutation
--    using createBrowserClient() with the anonymous key will be BLOCKED by RLS.
--    Before running this script in production:
--      a) Ensure SUPABASE_SERVICE_ROLE_KEY is configured in your server environment.
--      b) Ensure all admin mutations flow through /api/admin/* endpoints.
-- ========================================================================

-- 1. ENABLE ROW LEVEL SECURITY ON ALL MODULE TABLES
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.site_hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.site_instagram ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.story_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.site_story ENABLE ROW LEVEL SECURITY;

-- 2. DROP OBSOLETE OR INSECURE POLICIES
DROP POLICY IF EXISTS "Enable insert for all users" ON public.products;
DROP POLICY IF EXISTS "Enable update for all users" ON public.products;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.products;
DROP POLICY IF EXISTS "Admin manage products" ON public.products;

DROP POLICY IF EXISTS "Enable insert for all users" ON public.gallery_images;
DROP POLICY IF EXISTS "Enable update for all users" ON public.gallery_images;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.gallery_images;
DROP POLICY IF EXISTS "Admin manage gallery_images" ON public.gallery_images;

DROP POLICY IF EXISTS "Enable insert for all users" ON public.reviews;
DROP POLICY IF EXISTS "Enable update for all users" ON public.reviews;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.reviews;
DROP POLICY IF EXISTS "Admin manage reviews" ON public.reviews;

DROP POLICY IF EXISTS "Enable update for all users" ON public.site_hero;
DROP POLICY IF EXISTS "Admin manage site_hero" ON public.site_hero;

DROP POLICY IF EXISTS "Enable update for all users" ON public.site_instagram;
DROP POLICY IF EXISTS "Admin manage site_instagram" ON public.site_instagram;

DROP POLICY IF EXISTS "Enable update for all users" ON public.story_images;
DROP POLICY IF EXISTS "Admin manage story_images" ON public.story_images;

DROP POLICY IF EXISTS "Allow authenticated update on site_story" ON public.site_story;

-- 3. STRICT PUBLIC READ-ONLY POLICIES FOR STOREFRONT
-- Storefront visitors can only perform SELECT operations
CREATE POLICY "Public read products"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read gallery_images"
  ON public.gallery_images FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read reviews"
  ON public.reviews FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read site_hero"
  ON public.site_hero FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read site_instagram"
  ON public.site_instagram FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read story_images"
  ON public.story_images FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read site_story"
  ON public.site_story FOR SELECT
  TO anon, authenticated
  USING (true);

-- 4. SERVICE ROLE MUTATION POLICIES (SERVER-SIDE ONLY)
-- Only verified server-side calls carrying the service_role key can mutate data
CREATE POLICY "Service role manage products"
  ON public.products FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role manage gallery_images"
  ON public.gallery_images FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role manage reviews"
  ON public.reviews FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role manage site_hero"
  ON public.site_hero FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role manage site_instagram"
  ON public.site_instagram FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role manage story_images"
  ON public.story_images FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role manage site_story"
  ON public.site_story FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 5. STORAGE BUCKET 'products' HARDENING
-- Ensure bucket exists and is public for fast CDN image delivery
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Public can read assets via CDN
DROP POLICY IF EXISTS "Public read products bucket" ON storage.objects;
CREATE POLICY "Public read products bucket"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'products');

-- Only service_role can upload, replace, or delete storage objects
DROP POLICY IF EXISTS "Authenticated upload products bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update products bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete products bucket" ON storage.objects;

CREATE POLICY "Service role manage products bucket"
  ON storage.objects FOR ALL
  TO service_role
  USING (bucket_id = 'products')
  WITH CHECK (bucket_id = 'products');
