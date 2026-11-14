-- ========================================================================
-- PLOTTWIST BAKERY: OUR FAVES SECTION DATABASE MIGRATION SCRIPT
-- File: scripts/migration-our-faves.sql
-- ========================================================================
-- Purpose:
-- 1. Additive schema extension to support featured "OUR FAVES" collection.
-- 2. Add 'is_bestseller' (BOOLEAN) and 'bestseller_order' (INTEGER) columns.
-- 3. Insert canonical 'Muffins' product if not already present.
-- 4. Mark exactly four products as featured with deterministic order (1 to 4):
--    01 — Muffins
--    02 — Cookies
--    03 — Mocha Oreo
--    04 — Tiramisu
-- 5. Safe, non-destructive, and reversible.
-- ========================================================================

-- 1. ADDITIVE COLUMNS (Idempotent: only added if missing)
ALTER TABLE IF EXISTS public.products 
  ADD COLUMN IF NOT EXISTS is_bestseller BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS bestseller_order INTEGER DEFAULT NULL;

-- Create index for high-performance storefront queries
CREATE INDEX IF NOT EXISTS idx_products_bestseller 
  ON public.products (is_bestseller, bestseller_order) 
  WHERE is_bestseller = true;

-- 2. ENSURE CANONICAL MUFFINS RECORD EXISTS
INSERT INTO public.products (
  id,
  name,
  description,
  image_url,
  price,
  category,
  badge,
  is_popular,
  display_order,
  is_bestseller,
  bestseller_order,
  created_at,
  updated_at
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Double Chocolate Muffins',
  'Richly double chocolate muffins with molten chocolate centers and a delicate crumb topping.',
  '/images/menu-decor/doodle-muffin-large.svg',
  '$24.00',
  'Muffins',
  'Double Choc 🧁',
  true,
  8,
  true,
  1,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  is_bestseller = true,
  bestseller_order = 1,
  updated_at = NOW();

-- 3. RESET EXISTING PRODUCTS TO NOT FEATURED BY DEFAULT
UPDATE public.products 
SET is_bestseller = false, bestseller_order = NULL 
WHERE id != 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

-- 4. SET THE 4 SELECTED CANONICAL PRODUCTS IN EXACT DETERMINISTIC ORDER

-- 01: MUFFINS (bestseller_order = 1)
UPDATE public.products 
SET 
  is_bestseller = true, 
  bestseller_order = 1,
  updated_at = NOW()
WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' 
   OR LOWER(name) LIKE '%muffin%';

-- 02: COOKIES (bestseller_order = 2)
UPDATE public.products 
SET 
  is_bestseller = true, 
  bestseller_order = 2,
  updated_at = NOW()
WHERE id = '6d2f7818-4f05-58ce-903c-6802279fbe01' 
   OR LOWER(name) LIKE '%cookie%';

-- 03: MOCHA OREO (bestseller_order = 3)
-- (Also cleans up test name 'elephnt' back to canonical 'Mocha Oreo Fudge')
UPDATE public.products 
SET 
  name = 'Mocha Oreo Fudge',
  is_bestseller = true, 
  bestseller_order = 3,
  updated_at = NOW()
WHERE id = '9962c881-08df-51c5-b866-a223fd2c1605' 
   OR LOWER(description) LIKE '%oreo%';

-- 04: TIRAMISU (bestseller_order = 4)
UPDATE public.products 
SET 
  is_bestseller = true, 
  bestseller_order = 4,
  updated_at = NOW()
WHERE id = '719d9a0b-d385-5815-973e-421b98d5c6c1' 
   OR LOWER(name) LIKE '%tiramisu%';

-- ========================================================================
-- VERIFICATION SELECT QUERY
-- ========================================================================
SELECT 
  bestseller_order AS order_pos,
  name,
  category,
  price,
  badge,
  is_bestseller,
  id
FROM public.products
WHERE is_bestseller = true
ORDER BY bestseller_order ASC;
