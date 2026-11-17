-- ========================================================================
-- PLOTTWIST BAKERY: 004_verify_database.sql
-- Description: Non-destructive verification query suite.
-- Run this in the Supabase SQL Editor after applying 001, 002, and 003.
-- ========================================================================

-- 1. VERIFY TABLE INVENTORY & RECORD COUNTS
SELECT 
  'products' AS table_name, count(*) AS record_count, 8 AS expected_count FROM public.products
UNION ALL
SELECT 
  'reviews', count(*), 0 FROM public.reviews -- 0 expected as mock reviews are excluded pending authentic testimonials
UNION ALL
SELECT 
  'site_hero', count(*), 1 FROM public.site_hero
UNION ALL
SELECT 
  'site_story', count(*), 1 FROM public.site_story
UNION ALL
SELECT 
  'site_instagram', count(*), 1 FROM public.site_instagram;

-- 2. VERIFY COMPATIBILITY VIEW
SELECT 
  table_name,
  'VIEW' AS object_type
FROM information_schema.views
WHERE table_schema = 'public' AND table_name = 'story_images';

-- 3. VERIFY ROW LEVEL SECURITY (RLS) STATUS ON ALL TABLES
SELECT 
  schemaname,
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename IN ('products', 'reviews', 'site_hero', 'site_story', 'site_instagram')
ORDER BY tablename;

-- 4. VERIFY INSTALLED RLS POLICIES
SELECT 
  schemaname,
  tablename,
  policyname,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 5. VERIFY STORAGE BUCKET CONFIGURATION & MISMATCH DETECTION
-- Validates public access, 5 MB limit (5242880 bytes), and JPG/PNG/WEBP whitelist.
-- Reports any mismatch without altering the database.
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  CASE 
    WHEN public = true 
      AND file_size_limit = 5242880 
      AND allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]
    THEN 'CONFIG_VALID: Matches 5MB limit, public CDN, and JPG/PNG/WEBP whitelist'
    ELSE 'CONFIG_MISMATCH: Existing bucket settings differ from target configuration'
  END AS configuration_status
FROM storage.buckets
WHERE id = 'products';

-- 6. VERIFY STORAGE POLICIES
SELECT 
  schemaname,
  tablename,
  policyname,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects'
ORDER BY policyname;

-- 7. VERIFY FUNCTION EXECUTE PRIVILEGES (PUBLIC, anon, authenticated revoked)
SELECT 
  routine_name,
  grantee,
  privilege_type
FROM information_schema.routine_privileges
WHERE routine_schema = 'public' 
  AND routine_name IN ('handle_updated_at', 'handle_story_images_view_update')
ORDER BY routine_name, grantee;
