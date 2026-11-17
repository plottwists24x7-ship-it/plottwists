-- ========================================================================
-- PLOTTWIST BAKERY: 002_rls_policies.sql
-- Description: Row Level Security (RLS) policies for PlotTwist Bakery.
-- Tables: products, reviews, site_hero, site_story, site_instagram
-- Views: story_images
-- Functions: handle_updated_at, handle_story_images_view_update
-- Threat Model:
--   - Public storefront visitors (anon/authenticated) have READ-ONLY access.
--   - Mutations (INSERT, UPDATE, DELETE) are strictly denied to anon and authenticated users.
--   - Default PUBLIC execute on database routines is revoked to defend against direct RPC calls.
--   - Admin modifications are executed securely server-side via service_role
--     following HMAC admin session cookie verification.
-- Security Note: Strictly explicit least-privilege grants (No wildcard ALL TABLES grants).
-- Safe, non-destructive, and idempotent.
-- ========================================================================

-- 1. ENABLE ROW LEVEL SECURITY ON ALL APPLICATION TABLES
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_story ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_instagram ENABLE ROW LEVEL SECURITY;

-- ========================================================================
-- 2. PUBLIC READ ACCESS POLICIES (anon, authenticated)
-- ========================================================================

DROP POLICY IF EXISTS "Allow public read access on products" ON public.products;
CREATE POLICY "Allow public read access on products"
  ON public.products FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow public read access on reviews" ON public.reviews;
CREATE POLICY "Allow public read access on reviews"
  ON public.reviews FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow public read access on site_hero" ON public.site_hero;
CREATE POLICY "Allow public read access on site_hero"
  ON public.site_hero FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow public read access on site_story" ON public.site_story;
CREATE POLICY "Allow public read access on site_story"
  ON public.site_story FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow public read access on site_instagram" ON public.site_instagram;
CREATE POLICY "Allow public read access on site_instagram"
  ON public.site_instagram FOR SELECT TO anon, authenticated USING (true);

-- ========================================================================
-- 3. PRIVILEGED SERVICE ROLE POLICIES (service_role)
-- ========================================================================

DROP POLICY IF EXISTS "Allow service_role full access on products" ON public.products;
CREATE POLICY "Allow service_role full access on products"
  ON public.products FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service_role full access on reviews" ON public.reviews;
CREATE POLICY "Allow service_role full access on reviews"
  ON public.reviews FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service_role full access on site_hero" ON public.site_hero;
CREATE POLICY "Allow service_role full access on site_hero"
  ON public.site_hero FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service_role full access on site_story" ON public.site_story;
CREATE POLICY "Allow service_role full access on site_story"
  ON public.site_story FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service_role full access on site_instagram" ON public.site_instagram;
CREATE POLICY "Allow service_role full access on site_instagram"
  ON public.site_instagram FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ========================================================================
-- 4. EXPLICIT LEAST-PRIVILEGE SQL GRANTS & REVOCATIONS
-- Grants access ONLY to the specific application objects required by PlotTwist.
-- Wildcard schema grants are avoided.
-- ========================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Public roles can SELECT only on required application objects
GRANT SELECT ON TABLE public.products TO anon, authenticated;
GRANT SELECT ON TABLE public.reviews TO anon, authenticated;
GRANT SELECT ON TABLE public.site_hero TO anon, authenticated;
GRANT SELECT ON TABLE public.site_story TO anon, authenticated;
GRANT SELECT ON TABLE public.site_instagram TO anon, authenticated;
GRANT SELECT ON TABLE public.story_images TO anon, authenticated;

-- Explicitly revoke direct write permissions from public anon and authenticated roles
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.products FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.reviews FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.site_hero FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.site_story FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.site_instagram FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.story_images FROM anon, authenticated;

-- ========================================================================
-- 5. FUNCTION EXECUTE PRIVILEGE HARDENING
-- Revoke default PostgreSQL PUBLIC execution privileges on internal routines
-- to defend against unauthorized direct RPC invocations.
-- ========================================================================
REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_story_images_view_update() FROM PUBLIC, anon, authenticated;

-- Explicit permissions for service_role only on required application objects
GRANT ALL ON TABLE public.products TO service_role;
GRANT ALL ON TABLE public.reviews TO service_role;
GRANT ALL ON TABLE public.site_hero TO service_role;
GRANT ALL ON TABLE public.site_story TO service_role;
GRANT ALL ON TABLE public.site_instagram TO service_role;
GRANT ALL ON TABLE public.story_images TO service_role;

GRANT EXECUTE ON FUNCTION public.handle_updated_at() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_story_images_view_update() TO service_role;
