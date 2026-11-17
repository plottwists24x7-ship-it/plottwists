-- ========================================================================
-- PLOTTWIST BAKERY: 003_storage_setup.sql
-- Description: Supabase Storage bucket provisioning and access control policies.
-- Bucket: products (Public CDN delivery)
-- Constraints: 5 MB file size limit (5242880 bytes), strictly raster images (JPG, PNG, WEBP).
-- Security Note: SVG format is excluded to eliminate vector-based XSS attack vectors.
-- Non-Overwriting Policy: Uses ON CONFLICT (id) DO NOTHING.
--   If the bucket already exists, its configuration is NOT overwritten silently.
--   Use 004_verify_database.sql to detect and inspect any configuration mismatch.
-- Ownership Note: storage.objects is owned by supabase_storage_admin with RLS
--   permanently enabled by Supabase. RLS policies control all access.
--   No ALTER TABLE or table-level REVOKE is executed to avoid 42501 ownership errors.
-- Folder Architecture:
--   - products/   : Pastry and catalog product images
--   - hero/       : Homepage centerpiece hero bakes
--   - story/      : Polaroid and story badge images
--   - instagram/  : Instagram CTA dessert photos
--   - reviews/    : Customer review avatars
-- Safe, non-destructive, and idempotent.
-- ========================================================================

-- 1. CREATE 'products' STORAGE BUCKET (NON-OVERWRITING)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true,
  5242880, -- 5 MB file size limit (matches client-side and server-side MAX_IMAGE_FILE_SIZE)
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ========================================================================
-- 2. STORAGE ACCESS CONTROL POLICIES (ROW LEVEL SECURITY)
-- Note: RLS is enabled by default on storage.objects by Supabase.
-- In the absence of an INSERT/UPDATE/DELETE policy for anon/authenticated,
-- PostgreSQL RLS enforces DEFAULT DENY for all public write operations.
-- ========================================================================

-- A. PUBLIC READ ACCESS (Global CDN delivery for storefront visitors)
DROP POLICY IF EXISTS "Public Read Access for Products Bucket" ON storage.objects;
CREATE POLICY "Public Read Access for Products Bucket"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'products');

-- B. SERVICE ROLE FULL MANAGEMENT ACCESS
-- Permits the server-side API handler (/api/admin/upload) to upload, replace,
-- and delete assets using the private service-role key after HMAC session verification.
DROP POLICY IF EXISTS "Service Role Full Access for Products Bucket" ON storage.objects;
CREATE POLICY "Service Role Full Access for Products Bucket"
  ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'products')
  WITH CHECK (bucket_id = 'products');
