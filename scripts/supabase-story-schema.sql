-- ========================================================================
-- PLOTTWIST BAKERY: SUPABASE STORY CONTENT TABLE SCHEMA & RLS
-- Run this in your Supabase Dashboard SQL Editor to provision dedicated
-- cloud persistence for Story text, headlines, and call-to-actions.
-- ========================================================================

CREATE TABLE IF NOT EXISTS public.site_story (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  tagline TEXT NOT NULL DEFAULT '✨ ABOUT OUR BAKERY',
  title TEXT NOT NULL DEFAULT 'PLOTTWIST24X7',
  subtitle_script TEXT NOT NULL DEFAULT 'made with love ♡',
  note_left TEXT NOT NULL DEFAULT '"fresh every morning" 🥐',
  note_right TEXT NOT NULL DEFAULT '"slow fermentation" ♡',
  recipe_number TEXT NOT NULL DEFAULT 'RECIPE CARD № 042 • HANDCRAFTED',
  description TEXT NOT NULL DEFAULT 'Plotwist makes small-batch desserts with familiar ingredients, soft textures, and care that feels personal. We believe in taking time—nurturing sourdough starter, slow rising, and cooling pastries naturally.',
  cta_text TEXT NOT NULL DEFAULT 'SEE ALL BAKES',
  cta_link TEXT NOT NULL DEFAULT '#bakes',
  image TEXT NOT NULL DEFAULT '/images/baker-where/hero_bakery.jpg',
  image_alt TEXT NOT NULL DEFAULT 'Artisan bakery kitchen prep',
  image_caption TEXT NOT NULL DEFAULT 'artisan sourdough prep ♡',
  badge_bottom TEXT NOT NULL DEFAULT 'BAKED TODAY',
  stamp_top_text TEXT NOT NULL DEFAULT 'HANDMADE',
  stamp_bottom_text TEXT NOT NULL DEFAULT 'FRESH DAILY',
  chefs_pick_text TEXT NOT NULL DEFAULT '"chef''s pick" 🔥',
  batch_checklist JSONB NOT NULL DEFAULT '["✓ slow rise", "✓ better texture", "✓ more flavour 😊"]'::jsonb,
  founder_name TEXT NOT NULL DEFAULT 'Elena Rostova',
  founder_role TEXT NOT NULL DEFAULT 'Head Baker & Founder',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed single singleton record if empty
INSERT INTO public.site_story (
  id,
  tagline,
  title,
  subtitle_script,
  note_left,
  note_right,
  recipe_number,
  description,
  cta_text,
  cta_link,
  image,
  image_alt
) VALUES (
  '00000000-0000-0000-0000-000000000005',
  '✨ ABOUT OUR BAKERY',
  'PLOTTWIST24X7',
  'made with love ♡',
  '"fresh every morning" 🥐',
  '"slow fermentation" ♡',
  'RECIPE CARD № 042 • HANDCRAFTED',
  'Plotwist makes small-batch desserts with familiar ingredients, soft textures, and care that feels personal. We believe in taking time—nurturing sourdough starter, slow rising, and cooling pastries naturally.',
  'SEE ALL BAKES',
  '#bakes',
  '/images/baker-where/hero_bakery.jpg',
  'Artisan bakery kitchen prep'
) ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.site_story ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all visitors
CREATE POLICY "Allow public read access on site_story"
  ON public.site_story
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated administrator updates
CREATE POLICY "Allow authenticated update on site_story"
  ON public.site_story
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

