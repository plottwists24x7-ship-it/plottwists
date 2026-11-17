-- ========================================================================
-- PLOTTWIST BAKERY: 005_instagram_gallery_support.sql
-- Description: Enables multiple gallery entries in public.site_instagram while
--              preserving the existing singleton banner ('00000000-0000-0000-0000-000000000003').
-- Impact: Non-destructive.
--   1. Alters column `id` default to `gen_random_uuid()` so new entries receive unique IDs.
--   2. Adds `display_order` (INTEGER, default 0) for gallery ordering.
--   3. Adds `is_active` (BOOLEAN, default true).
--   4. Preserves row '00000000-0000-0000-0000-000000000003' intact as display_order 0.
--   5. Storefront queries targeting '00000000-0000-0000-0000-000000000003' continue working identically.
-- ========================================================================

-- 1. Alter ID default from hardcoded singleton to dynamic UUID generator
ALTER TABLE public.site_instagram
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 2. Add display_order column for sorting multiple entries
ALTER TABLE public.site_instagram
  ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0;

-- 3. Add is_active column for toggling visibility
ALTER TABLE public.site_instagram
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

-- 4. Index for display_order ordering
CREATE INDEX IF NOT EXISTS idx_site_instagram_display_order
  ON public.site_instagram (display_order ASC);

-- 5. Ensure existing banner record is preserved at display_order 0
UPDATE public.site_instagram
  SET display_order = 0
  WHERE id = '00000000-0000-0000-0000-000000000003'::uuid;
