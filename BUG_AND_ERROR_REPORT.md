# Comprehensive Bug and Error Report

## 1. Executive Summary
During the engineering hardening phase, a total of 14 distinct system defects were uncovered across the application stack. These ranged from critical data resolution bugs that prevented cloud-uploaded images from displaying, to database schema omissions that dropped administrative story modifications, and React 19 lifecycle warnings causing cascading re-renders.

Every identified bug has been analyzed, reproduced, resolved with targeted code modifications, and independently verified.

---

## 2. Exhaustive Bug Inventory & Remediation Log

### Bug 1: Cloud Storage Image URL Resolution Failure
- **Severity**: Critical (P0)
- **File**: `src/lib/supabase/client.ts` (`getProductImageUrl`)
- **Symptoms**: After an administrator successfully uploaded an image to the Supabase `products` storage bucket, the frontend failed to display it, falling back to a 404 or broken local placeholder.
- **Root Cause**: `getProductImageUrl` contained an aggressive prefix check:
  ```ts
  if (image.startsWith("products/")) {
    return `/images/baker-where/${image.replace("products/", "")}`;
  }
  ```
  Real cloud storage paths returned by Supabase (`products/1773491234567-uuid.jpg`) were mistakenly stripped of their storage path and rewritten into non-existent local public directories (`/images/baker-where/1773491234567-uuid.jpg`).
- **Fix**: Replaced with strict prefix discrimination that only maps known static sample filenames, while resolving all real storage paths via `supabase.storage.from("products").getPublicUrl(path).data.publicUrl`.
- **Verification**: Verified using sample uploaded paths; valid Supabase public storage URLs are now correctly returned.

---

### Bug 2: Story Text Content Not Persisting Across Sessions
- **Severity**: Critical (P0)
- **Files**: `src/context/AdminContext.tsx`, `src/components/sections/Story.tsx`, `app/admin/story/page.tsx`
- **Symptoms**: Story text edits made in the Admin CMS disappeared upon refreshing the browser or opening the site from another device.
- **Root Cause**: The Supabase database schema had no table or columns for story text (only `story_images` storing 4 image URLs). The application was silently writing story copy solely to browser `localStorage`.
- **Fix**:
  1. Built a robust server-side persistence module `src/lib/story-store.ts`.
  2. Implemented public read endpoint `app/api/story/route.ts` with Next.js revalidation caching.
  3. Implemented authenticated admin write endpoint `app/api/admin/story/route.ts` enforcing HMAC session authorization.
  4. Authored `scripts/supabase-story-schema.sql` providing the exact table schema (`site_story`) and RLS policies for database synchronization.
  5. Updated `AdminContext.tsx` to initialize story state from the server endpoint on mount and persist updates to the API.
  6. Updated `src/components/sections/Story.tsx` to dynamically bind all text fields (`story.tagline`, `story.title`, `story.subtitleScript`, `story.description`, `story.ctaText`) across both desktop and mobile viewports.
- **Verification**: Manual sequence test executed: Admin edits story text -> Save button triggers API POST -> response 200 OK -> page refresh reloads updated text -> public storefront displays updated text.

---

### Bug 3: Base64 Fallback Writing Multi-Megabyte Payloads to Database
- **Severity**: High (P1)
- **File**: `src/lib/supabase/client.ts` (`uploadImage`)
- **Symptoms**: When Supabase Storage uploads encountered permission errors, `uploadImage` converted files to raw Base64 Data URLs and returned them as image paths. This bloated database rows up to 3+ MB per item.
- **Root Cause**: Defensive fallback designed for demo environments was active in production code.
- **Fix**: Removed the Base64 Data URL fallback entirely for new uploads. The function now validates file types (image/*), checks size limits (≤10 MB), uploads to Supabase Storage, and throws informative, actionable errors if cloud storage fails. Existing Base64 records continue to be supported for backward-compatible rendering.
- **Verification**: Attempting an upload without storage authorization now immediately returns a clean error modal rather than dumping megabytes into the database.

---

### Bug 4: Duplicate DOM Tree and Missing Dynamic Bindings in Story Section
- **Severity**: Medium (P2)
- **File**: `src/components/sections/Story.tsx`
- **Symptoms**: Edits to the brand narrative updated the desktop layout but left the mobile layout displaying hardcoded static text.
- **Root Cause**: `Story.tsx` contained two separate rendering branches (one for desktop, one for mobile). The desktop branch had partial dynamic bindings, while the mobile branch had hardcoded strings.
- **Fix**: Synchronized both desktop and mobile JSX trees to consume dynamic properties from `story` state (`story.tagline`, `story.title`, `story.subtitleScript`, `story.description`, `story.ctaText`).
- **Verification**: Verified mobile viewport responsiveness; identical dynamic copy renders on all screen sizes.

---

### Bug 5: Duplicate Toasts and Missing React Hook Dependencies
- **Severity**: Medium (P2)
- **Files**: `app/admin/hero/page.tsx`, `app/admin/instagram/page.tsx`, `src/context/AdminContext.tsx`
- **Symptoms**: Multiple overlapping toast notifications flashed on save operations; React warning about stale closures in `AdminContext`.
- **Root Cause**: `AdminHeroPage` rendered its own local toast banner while `AdminContext` simultaneously dispatched global toasts. Additionally, `AdminContext` callbacks (`updateBake`, `updateHero`, etc.) omitted `showToast` from their dependency arrays.
- **Fix**: Removed duplicate local toasts from hero and instagram pages, relying on the unified global toast system in `AdminContext`. Added `showToast` to all `useCallback` dependency arrays.
- **Verification**: Save actions now render a single, clean notification toast.

---

### Bug 6: React 19 `react-hooks/set-state-in-effect` Cascading Render Warnings
- **Severity**: Medium (P2)
- **Files**:
  - `src/components/admin/BakeFormModal.tsx`
  - `src/components/admin/GalleryFormModal.tsx`
  - `src/components/admin/ReviewFormModal.tsx`
  - `app/admin/hero/page.tsx`
  - `app/admin/instagram/page.tsx`
  - `app/admin/story/page.tsx`
- **Symptoms**: 6 ESLint warnings across admin components: `Calling setState synchronously within an effect can trigger cascading renders`.
- **Root Cause**: Using `useEffect` to copy prop values into local state when props changed.
- **Fix**: Migrated to the official React-recommended pattern: storing `prevData` / `prevOpen` in state and synchronizing local state during render when a prop discrepancy is detected, completely eliminating the synchronous `useEffect`.
- **Verification**: ESLint warnings reduced to zero; zero cascading renders.

---

### Bug 7: Orphaned Duplicate Stylesheet
- **Severity**: Low (P3)
- **File**: `src/styles/globals.css`
- **Symptoms**: Confusion during styling updates; redundant stylesheet in project tree.
- **Root Cause**: `app/globals.css` was the active stylesheet referenced in `app/layout.tsx`. An older duplicate file existed in `src/styles/globals.css`.
- **Fix**: Deleted `src/styles/globals.css`.
- **Verification**: Build and styling verified intact.

---

### Bug 8: Dead Dependency in Package Manifest
- **Severity**: Low (P3)
- **File**: `package.json`
- **Symptoms**: `ffmpeg-static` (^5.3.0) included in `package.json` dependencies, inflating bundle and lockfile size.
- **Root Cause**: Leftover video transcoding dependency from an abandoned feature.
- **Fix**: Removed `"ffmpeg-static": "^5.3.0"` from `package.json`.
- **Verification**: Clean build with zero impact on functionality.

---

## 3. Summary of Status Across All Bugs

| Defect ID | Description | Root Cause | Status |
| :--- | :--- | :--- | :--- |
| **BUG-01** | `getProductImageUrl` path mangling | Stripped `products/` storage prefix | **FIXED & VERIFIED** |
| **BUG-02** | Story text not persisting | Missing database table, relying on localStorage | **FIXED & VERIFIED** |
| **BUG-03** | Base64 fallback in image uploader | Defensive fallback to data URLs | **FIXED & VERIFIED** |
| **BUG-04** | Story mobile hardcoded text | Duplicate mobile DOM without state bindings | **FIXED & VERIFIED** |
| **BUG-05** | Duplicate toasts on admin save | Simultaneous local & global toast dispatch | **FIXED & VERIFIED** |
| **BUG-06** | React 19 `set-state-in-effect` (6 files)| Props-to-state synchronization in `useEffect` | **FIXED & VERIFIED** |
| **BUG-07** | Orphaned duplicate globals.css | Legacy stylesheet in `src/styles/` | **FIXED & VERIFIED** |
| **BUG-08** | Unused `ffmpeg-static` dependency | Legacy dependency in `package.json` | **FIXED & VERIFIED** |
| **BUG-09** | Unused parameter in `auth.ts` | Omitted error binding in catch block | **FIXED & VERIFIED** |
| **BUG-10** | Unused icons across admin pages | Leftover Lucide icon imports | **FIXED & VERIFIED** |
| **BUG-11** | Unused `AdminProvider` in admin layout | Redundant context wrapper | **FIXED & VERIFIED** |
| **BUG-12** | Gallery PhotoCard zIndex prop | Missing inline style z-index | **FIXED & VERIFIED** |
| **BUG-13** | ReviewCard unoptimized `<img>` | Legacy HTML image element | **FIXED & VERIFIED** |
| **BUG-14** | Story `unoptimized={true}` flag | Bypassed Next.js image optimization | **FIXED & VERIFIED** |

