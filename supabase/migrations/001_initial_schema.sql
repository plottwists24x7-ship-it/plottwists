-- ========================================================================
-- PLOTTWIST BAKERY: 001_initial_schema.sql
-- Description: Core schema definition for PlotTwist Bakery (PostgreSQL / Supabase)
-- Target: Clean Supabase project
-- Tables: products, reviews, site_hero, site_story, site_instagram
-- Views: story_images (with INSTEAD OF UPDATE trigger for full backward compatibility)
-- Excludes: gallery_images (permanently excluded per project scope)
-- Safety: Idempotent and non-destructive. All inserts use ON CONFLICT (id) DO NOTHING.
-- Note on Reviews: Mock/unconfirmed reviews are EXCLUDED from seed data pending
--                  user confirmation of authentic customer testimonials.
-- Security: Functions declare explicit SET search_path to prevent path hijacking.
-- ========================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. AUTOMATIC UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ========================================================================
-- TABLE 1: public.products
-- Purpose: Stores all bakery catalog items and featured "Our Faves" bestsellers
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  price TEXT DEFAULT NULL,
  category TEXT NOT NULL DEFAULT 'Cheesecakes',
  badge TEXT DEFAULT NULL,
  is_popular BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_bestseller BOOLEAN NOT NULL DEFAULT false,
  bestseller_order INTEGER DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_display_order 
  ON public.products (display_order ASC);

CREATE INDEX IF NOT EXISTS idx_products_bestseller 
  ON public.products (is_bestseller, bestseller_order ASC) 
  WHERE is_bestseller = true;

CREATE INDEX IF NOT EXISTS idx_products_category 
  ON public.products (category);

-- Trigger for auto updated_at
DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ========================================================================
-- TABLE 2: public.reviews
-- Purpose: Stores authentic customer testimonials, star ratings, and review avatars
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_image TEXT NOT NULL,
  review TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  verified BOOLEAN NOT NULL DEFAULT false,
  review_date TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for ordering reviews
CREATE INDEX IF NOT EXISTS idx_reviews_created_at 
  ON public.reviews (created_at DESC);

-- Trigger for auto updated_at
DROP TRIGGER IF EXISTS trg_reviews_updated_at ON public.reviews;
CREATE TRIGGER trg_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ========================================================================
-- TABLE 3: public.site_hero
-- Purpose: Stores the centerpiece dessert photo, aspect ratio, crop scale,
--          and handwritten keepsake captions for the storefront Hero section.
-- Pattern: Singleton record ('00000000-0000-0000-0000-000000000001')
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.site_hero (
  id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001'::uuid,
  image_url TEXT NOT NULL DEFAULT '/cheesecake.png',
  alt_text TEXT NOT NULL DEFAULT 'Signature Artisanal Cheesecake',
  caption_title TEXT NOT NULL DEFAULT 'today''s batch ♡',
  caption_subtitle TEXT NOT NULL DEFAULT 'Mom''s Special',
  scale NUMERIC NOT NULL DEFAULT 1.03,
  object_fit TEXT NOT NULL DEFAULT 'cover',
  aspect_ratio TEXT NOT NULL DEFAULT '4:3',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger for auto updated_at
DROP TRIGGER IF EXISTS trg_site_hero_updated_at ON public.site_hero;
CREATE TRIGGER trg_site_hero_updated_at
  BEFORE UPDATE ON public.site_hero
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ========================================================================
-- TABLE 4: public.site_story (UNIFIED STORY TABLE)
-- Purpose: Unifies Story text, headlines, recipe card note, batch checklist,
--          and the 4 dynamic story images (main polaroid + 3 feature badges)
--          into a single persistent cloud record.
-- Pattern: Singleton record ('00000000-0000-0000-0000-000000000002')
-- Note: Contains only verified editorial and visual content actually used
--       by the PlotTwist website and admin editor (no fabricated identities).
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.site_story (
  id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000002'::uuid,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  -- Editorial Text Fields (Approved PlotTwist Copy)
  tagline TEXT NOT NULL DEFAULT '✨ ABOUT OUR BAKERY',
  title TEXT NOT NULL DEFAULT 'PLOTTWIST24X7',
  subtitle_script TEXT NOT NULL DEFAULT 'made with love ♡',
  note_left TEXT NOT NULL DEFAULT '"fresh every morning" 🥐',
  note_right TEXT NOT NULL DEFAULT '"slow fermentation" ♡',
  recipe_number TEXT NOT NULL DEFAULT 'RECIPE CARD № 042 • HANDCRAFTED',
  description TEXT NOT NULL DEFAULT 'Plotwist makes small-batch desserts with familiar ingredients, soft textures, and care that feels personal. We believe in taking time—nurturing sourdough starter, slow rising, and cooling pastries naturally.',
  cta_text TEXT NOT NULL DEFAULT 'SEE OUR FAVES',
  cta_link TEXT NOT NULL DEFAULT '#faves',
  badge_bottom TEXT NOT NULL DEFAULT 'BAKED TODAY',
  stamp_top_text TEXT NOT NULL DEFAULT 'HANDMADE',
  stamp_bottom_text TEXT NOT NULL DEFAULT 'FRESH DAILY',
  chefs_pick_text TEXT NOT NULL DEFAULT '"chef''s pick" 🔥',
  batch_checklist JSONB NOT NULL DEFAULT '["✓ slow rise", "✓ better texture", "✓ more flavour 😊"]'::jsonb,
  -- 4 Unified Story Images (Verified Local Paths)
  main_polaroid_url TEXT NOT NULL DEFAULT '/images/baker-where/hero_bakery.jpg',
  main_polaroid_alt TEXT NOT NULL DEFAULT 'Artisan bakery kitchen prep',
  badge_1_url TEXT NOT NULL DEFAULT '/images/baker-where/prod_pancakes.jpg',
  badge_1_label TEXT NOT NULL DEFAULT '24 countries',
  badge_2_url TEXT NOT NULL DEFAULT '/images/baker-where/prod_tiramisu.jpg',
  badge_2_label TEXT NOT NULL DEFAULT '100% wholesome',
  badge_3_url TEXT NOT NULL DEFAULT '/images/baker-where/prod_biscoff_brownie.jpg',
  badge_3_label TEXT NOT NULL DEFAULT 'trusted quality',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger for auto updated_at
DROP TRIGGER IF EXISTS trg_site_story_updated_at ON public.site_story;
CREATE TRIGGER trg_site_story_updated_at
  BEFORE UPDATE ON public.site_story
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ========================================================================
-- BACKWARD COMPATIBILITY: public.story_images VIEW + INSTEAD OF UPDATE TRIGGER
-- Allows existing callers querying or updating `story_images` to read and
-- write seamlessly against the underlying `public.site_story` table.
-- ========================================================================
CREATE OR REPLACE VIEW public.story_images AS
  SELECT 
    id,
    main_polaroid_url,
    badge_1_url,
    badge_2_url,
    badge_3_url,
    updated_at
  FROM public.site_story;

CREATE OR REPLACE FUNCTION public.handle_story_images_view_update()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.site_story
  SET
    main_polaroid_url = COALESCE(NEW.main_polaroid_url, main_polaroid_url),
    badge_1_url = COALESCE(NEW.badge_1_url, badge_1_url),
    badge_2_url = COALESCE(NEW.badge_2_url, badge_2_url),
    badge_3_url = COALESCE(NEW.badge_3_url, badge_3_url),
    updated_at = now()
  WHERE id = OLD.id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_story_images_view_update ON public.story_images;
CREATE TRIGGER trg_story_images_view_update
  INSTEAD OF UPDATE ON public.story_images
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_story_images_view_update();

-- ========================================================================
-- TABLE 5: public.site_instagram
-- Purpose: Stores the featured dessert cutout photo and metadata for the
--          high-conversion Instagram community section.
-- Pattern: Singleton record ('00000000-0000-0000-0000-000000000003')
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.site_instagram (
  id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000003'::uuid,
  image_url TEXT NOT NULL DEFAULT '/images/baker-where/instagram_cta_dessert.jpg',
  alt_text TEXT NOT NULL DEFAULT 'PlotTwist24x signature gourmet cake dessert',
  eyebrow TEXT NOT NULL DEFAULT 'Fresh from our oven →',
  heading_line1 TEXT NOT NULL DEFAULT 'ONE LAST',
  heading_line2 TEXT NOT NULL DEFAULT 'SWEET STOP...',
  description TEXT NOT NULL DEFAULT 'Fresh bakes. Behind-the-scenes moments. New flavours. Tiny baking chaos. Follow us and never miss a sweet surprise.',
  quote TEXT NOT NULL DEFAULT 'Every dessert has a story. Come watch ours.',
  instagram_handle TEXT NOT NULL DEFAULT '@plottwist24x',
  instagram_url TEXT NOT NULL DEFAULT 'https://www.instagram.com/plottwist24x7?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==',
  cta_text TEXT NOT NULL DEFAULT 'FOLLOW',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger for auto updated_at
DROP TRIGGER IF EXISTS trg_site_instagram_updated_at ON public.site_instagram;
CREATE TRIGGER trg_site_instagram_updated_at
  BEFORE UPDATE ON public.site_instagram
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ========================================================================
-- CANONICAL SEED DATA (SAFE, IDEMPOTENT, NON-DESTRUCTIVE INSERTS)
-- All inserts use ON CONFLICT (id) DO NOTHING so existing data is NEVER overwritten.
-- ========================================================================

-- Seed Singleton: Site Hero
INSERT INTO public.site_hero (
  id,
  image_url,
  alt_text,
  caption_title,
  caption_subtitle,
  scale,
  object_fit,
  aspect_ratio
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '/cheesecake.png',
  'Signature Artisanal Cheesecake',
  'today''s batch ♡',
  'Mom''s Special',
  1.03,
  'cover',
  '4:3'
) ON CONFLICT (id) DO NOTHING;

-- Seed Singleton: Site Story (Unified)
INSERT INTO public.site_story (
  id,
  is_enabled,
  tagline,
  title,
  subtitle_script,
  note_left,
  note_right,
  recipe_number,
  description,
  cta_text,
  cta_link,
  main_polaroid_url,
  main_polaroid_alt,
  badge_1_url,
  badge_1_label,
  badge_2_url,
  badge_2_label,
  badge_3_url,
  badge_3_label
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  true,
  '✨ ABOUT OUR BAKERY',
  'PLOTTWIST24X7',
  'made with love ♡',
  '"fresh every morning" 🥐',
  '"slow fermentation" ♡',
  'RECIPE CARD № 042 • HANDCRAFTED',
  'Plotwist makes small-batch desserts with familiar ingredients, soft textures, and care that feels personal. We believe in taking time—nurturing sourdough starter, slow rising, and cooling pastries naturally.',
  'SEE OUR FAVES',
  '#faves',
  '/images/baker-where/hero_bakery.jpg',
  'Artisan bakery kitchen prep',
  '/images/baker-where/prod_pancakes.jpg',
  '24 countries',
  '/images/baker-where/prod_tiramisu.jpg',
  '100% wholesome',
  '/images/baker-where/prod_biscoff_brownie.jpg',
  'trusted quality'
) ON CONFLICT (id) DO NOTHING;

-- Seed Singleton: Site Instagram
INSERT INTO public.site_instagram (
  id,
  image_url,
  alt_text
) VALUES (
  '00000000-0000-0000-0000-000000000003',
  '/images/baker-where/instagram_cta_dessert.jpg',
  'PlotTwist24x signature gourmet cake dessert'
) ON CONFLICT (id) DO NOTHING;

-- Seed Canonical Products (Including the Four "Our Faves" Bestsellers in Deterministic Order)
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
  bestseller_order
) VALUES
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Double Chocolate Muffins',
    'Richly double chocolate muffins with molten chocolate centres and a delicate crumb topping.',
    '/images/menu-decor/doodle-muffin-large.svg',
    '$24.00',
    'Muffins',
    'Double Choc 🧁',
    true,
    1,
    true,
    1
  ),
  (
    '6d2f7818-4f05-58ce-903c-6802279fbe01',
    'Chocolate Chip Cookies',
    'Crispy golden edges with warm molten chocolate pockets, baked fresh throughout the morning.',
    '/images/baker-where/prod_chocolate_cookies.jpg',
    '$18.00',
    'Cookies',
    'Molten Chips ✨',
    true,
    2,
    true,
    2
  ),
  (
    '9962c881-08df-51c5-b866-a223fd2c1605',
    'Mocha Oreo Fudge',
    'Rich chocolate fudge folded with crunchy Oreo crumbs, espresso roast notes and a soft melt-in-your-mouth centre.',
    '/images/baker-where/prod_oreo_fudge.jpg',
    '$26.00',
    'Brownies',
    'Double Choc 🍫',
    true,
    3,
    true,
    3
  ),
  (
    '719d9a0b-d385-5815-973e-421b98d5c6c1',
    'Venetian Tiramisu',
    'Layered espresso-soaked ladyfingers, velvety mascarpone cream and dusted Dutch cocoa.',
    '/images/baker-where/prod_tiramisu.jpg',
    '$32.00',
    'Tiramisu',
    'Espresso Kick ☕',
    true,
    4,
    true,
    4
  ),
  (
    'c2d3e4f5-a6b7-8901-cdef-0123456789ab',
    'Basque Cheesecake',
    'Silky, creamy, lightly baked cheesecake with a buttery biscuit base and fresh berry drizzle.',
    '/images/baker-where/prod_cheesecake.jpg',
    '$38.00',
    'Cheesecakes',
    'Lightly Baked 🍓',
    true,
    5,
    false,
    NULL
  ),
  (
    'd3e4f5a6-b7c8-9012-defa-123456789abc',
    'Fluffy Pancakes',
    'Fluffy golden stacks made for slow mornings, soft bites, extra syrup, and rich whipped cream.',
    '/images/baker-where/prod_pancakes.jpg',
    '$22.00',
    'Pastries',
    'Fluffy Stacks 🥞',
    true,
    6,
    false,
    NULL
  ),
  (
    'e4f5a6b7-c8d9-0123-efab-23456789abcd',
    'Biscoff Brownie',
    'Deep fudgy brownie finished with caramelised Biscoff spread and a warm gooey centre.',
    '/images/baker-where/prod_biscoff_brownie.jpg',
    '$24.00',
    'Brownies',
    'Gooey Centre 🍪',
    true,
    7,
    false,
    NULL
  ),
  (
    'f5a6b7c8-d9e0-1234-fabc-3456789abcde',
    'Red Velvet Cake',
    'Tender cocoa-red sponge layered with smooth cream-cheese frosting and white chocolate curls.',
    '/images/baker-where/prod_red_velvet.jpg',
    '$42.00',
    'Cakes',
    'Cream Frosting 🧁',
    false,
    8,
    false,
    NULL
  )
ON CONFLICT (id) DO NOTHING;
