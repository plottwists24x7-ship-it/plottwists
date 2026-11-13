# Project Overview: PlotTwist Bakery

## 1. Executive Summary
PlotTwist Bakery is a production full-stack web application designed for a boutique artisanal bakery. It encompasses a customer-facing responsive storefront showcasing signature cheesecakes, bakes, storytelling, photo gallery, customer testimonials, and an Instagram showcase, backed by a comprehensive administrative Content Management System (CMS) for real-time inventory, hero curation, story copy, review management, and photo uploads.

This document details the architectural baseline, technology stack, environment topology, and transition from an unstable, vulnerability-laden prototype to a hardened, enterprise-grade Next.js 16 + React 19 application.

---

## 2. Technology Stack & Runtime Topology

| Layer | Technology | Specification / Version | Role & Boundary |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js App Router | `16.2.10` with Turbopack | Server & Client orchestration, Hybrid RSC + Static prerendering |
| **UI Library** | React | `19.2.4` | Modern React 19 concurrent features, action hooks, compiler compatibility |
| **Language** | TypeScript | `^5` (Strict Mode) | Full type safety across storefront, CMS, and Supabase schemas |
| **Styling** | Tailwind CSS v4 | `@tailwindcss/postcss` | Utility-first CSS, `@theme` token definitions, custom animations |
| **Font Pipeline** | `next/font/google` | Self-hosted WOFF2 | Zero external Google Fonts network calls; 12 font variables in layout |
| **Database** | Supabase PostgreSQL | Remote managed instance | Relational store for `products`, `reviews`, `gallery_images`, `site_hero`, `site_instagram`, `story_images` |
| **Object Storage**| Supabase Storage | Bucket `products` | Cloud binary storage for optimized product, hero, story, and gallery photography |
| **Authentication**| HMAC-SHA256 Sessions | Native Web Crypto API | Stateless signed HTTP-only cookies with `iat`, `exp`, `jti` nonces |
| **Deployment** | Vercel Serverless | Edge Middleware + Node.js | Static frontend edge CDN with serverless functions for CMS operations |

---

## 3. Application Architecture & Environments

### A. Public Storefront (`app/page.tsx`)
The storefront is fully rendered as a **React Server Component (RSC)** at build time (`○ Static`), delivering instant First Contentful Paint (FCP) and optimal SEO with zero client-side JavaScript hydration blocking:
1. **Header & Navigation (`src/components/Header.tsx`)**: Responsive navigation bar with scroll state detection (via `requestAnimationFrame` + `IntersectionObserver`), mobile slide-over menu, and discreet administrative gateway.
2. **Hero Section (`src/components/ScrapbookHeroRedesign.tsx`)**: Visually engaging scrapbook aesthetic with hero cheesecake imagery, floating stickers, decorative badges, and smooth anchor routing.
3. **Story Section (`src/components/sections/Story.tsx`)**: Multi-layered polaroid and badge layout highlighting brand heritage, dynamic copy from database/persistent store, and 3D tilt effects.
4. **Bakes & Products (`src/components/sections/Bakes.tsx`)**: Filterable product catalog segmented by categories (Cheesecakes, Brownies, Cookies, Cakes, Tiramisu, Pastries, Seasonal).
5. **Kitchen Gallery (`src/components/sections/Gallery.tsx`)**: Masonry photo collage with category filters, zoom interactions, and SVG polaroid tape overlays.
6. **Customer Reviews (`src/components/sections/Reviews.tsx`)**: Continuous infinite CSS-marquee carousel featuring verified customer ratings and real photos.
7. **Instagram CTA (`src/components/sections/InstagramCTA.tsx`)**: High-conversion social engagement module linking visitors to `@plottwist24x`.
8. **Footer (`src/components/sections/Footer.tsx`)**: Location badges, operational hours, legal notices, and administrative access links.

### B. Admin CMS (`app/admin/*`)
A dedicated administrative dashboard secured by server-side HMAC session cookies:
1. **Authentication (`/admin/login`)**: Constant-time password verification against environment secrets, issuance of 7-day signed session cookies.
2. **Dashboard Overview (`/admin/dashboard`)**: Metric cards for catalog counts, published reviews, gallery assets, and live health status.
3. **Bake Inventory (`/admin/bakes`)**: Full CRUD operations for menu items with direct Supabase Storage image uploads.
4. **Story Editor (`/admin/story`)**: Real-time management of brand copy and 4 primary story polaroid/badge images.
5. **Hero Customizer (`/admin/hero`)**: Focal image replacement, aspect ratio selection, scale controls, and live preview.
6. **Gallery Curator (`/admin/gallery`)**: Multi-file batch upload and categorization for kitchen and bake snapshots.
7. **Reviews Moderation (`/admin/reviews`)**: Inline editing, star rating modification, customer photo updates, and verification badges.
8. **Instagram CTA Manager (`/admin/instagram`)**: Dynamic banner image uploads and caption synchronization.

---

## 4. Engineering Baseline vs. Resolved State

| Evaluation Dimension | Initial Baseline (Phase 0/1) | Hardened Production State |
| :--- | :--- | :--- |
| **TypeScript Type Safety** | 13 errors, suppressions, `any` usage | **0 errors** (`npx tsc --noEmit` clean) |
| **ESLint Hygiene** | 79 errors / 59 warnings | **0 errors, 0 warnings** (`npm run lint` clean) |
| **Production Build** | Failing on duplicate types / client hooks | **17/17 routes compiled cleanly** in 4.0s (Turbopack) |
| **Storefront Root Component** | Client-heavy `'use client'` wrapper | **Pure React Server Component (RSC)** |
| **Font Network Calls** | 25 external font imports blocking render | **0 external font imports**; 100% self-hosted `next/font` |
| **Authentication Architecture** | Mock `localStorage` flag or plain cookies | **Cryptographic HMAC-SHA256**, constant-time check, 12/12 unit tests passing |
| **Database RLS & Security** | Incomplete verification, anonymous writes | Automated probe audit + SQL hardening script authored |
| **Image Storage Strategy** | Base64 strings (multi-MB) in DB rows | Pure Supabase Cloud Storage; Base64 fallback eliminated |
| **Story Persistence** | Only in browser `localStorage` | Server API + persistent store (`/api/story`, `/api/admin/story`) |
| **GPU / Compositing Lag** | SVG `feTurbulence` running on viewport | Replaced with lightweight GPU-cached 128px pattern tile |
| **Scroll Reflows** | Unthrottled `getBoundingClientRect` | Replaced with `requestAnimationFrame` + `IntersectionObserver` |

