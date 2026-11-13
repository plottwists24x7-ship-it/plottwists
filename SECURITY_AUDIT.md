# Comprehensive Security Audit Report

## 1. Executive Summary
A comprehensive security review was conducted covering the authentication boundary, session management, cryptographic primitives, database Row Level Security (RLS), cloud storage access policies, and dependency supply chain vulnerabilities.

The authentication system was verified against strict cryptographic criteria and passed 12/12 automated security tests. A live database probe identified that while Supabase Storage enforces strict write protection, the PostgreSQL tables currently lack strict administrative RLS policies. An automated SQL hardening script (`scripts/supabase-security.sql`) was developed for execution by the database administrator.

---

## 2. Authentication System Security Verification

### A. Cryptographic Session Architecture (`src/lib/auth.ts`)
1. **Stateless HMAC-SHA256 Token Format**:
   - Format: `base64url(payload).base64url(signature)`
   - Payload schema: `{ iat: number, exp: number, jti: string, role: "admin" }`
   - Generated using the native Node.js / Web Crypto API (`crypto.createHmac("sha256", secret)`).
2. **Cryptographic Entropy & Key Management**:
   - Environment secret `ADMIN_SESSION_SECRET` is required for signing.
   - Verified that missing secrets result in an immediate fail-closed state (`return false` / HTTP 500 error).
   - Minimum entropy recommendation: 256 bits (32 bytes) of cryptographically random hex/base64.
3. **Constant-Time Verification**:
   - Both password verification (`verifyAdminPassword`) and HMAC signature verification (`verifySessionToken`) employ constant-time comparison via `crypto.timingSafeEqual`.
   - Protects against timing side-channel attacks where attackers measure microsecond discrepancies to guess secret bytes.
4. **Temporal Token Controls**:
   - Expiration (`exp`): Strictly enforced; tokens older than 7 days (`SESSION_MAX_AGE = 7 * 24 * 60 * 60`) are rejected.
   - Clock Skew Protection: Issued-at (`iat`) values greater than current time + 60 seconds are rejected to block future-dated forged tokens.
   - Token Nonce (`jti`): Cryptographically random UUID included in every session payload.
5. **Cookie Security Profile**:
   - Flag `HttpOnly`: Enabled (prevents access via client JavaScript, protecting against XSS session theft).
   - Flag `Secure`: Enabled in production (`process.env.NODE_ENV === "production"`).
   - Flag `SameSite: "lax"`: Protects against cross-origin CSRF attacks on GET and top-level navigations.
   - Path: `/` (accessible to all administrative endpoints).
   - Expiration: Synchronized to 7 days (`maxAge = 604800`), matching token payload `exp`.

### B. Automated Authentication Test Suite (`scripts/test-auth.ts`)
All 12 unit tests executed and passed:
1. `Valid Token Verification` -> **PASS**
2. `Expired Token Rejection` -> **PASS**
3. `Tampered Payload Rejection` -> **PASS**
4. `Tampered Signature Rejection` -> **PASS**
5. `Malformed Token Structure Rejection` -> **PASS**
6. `Invalid JSON Payload Rejection` -> **PASS**
7. `Future-Issued Token Rejection (>60s clock skew)` -> **PASS**
8. `Missing Environment Variables (Fail-Closed)` -> **PASS**
9. `Valid Password Verification` -> **PASS**
10. `Invalid Password Rejection` -> **PASS**
11. `Logout Cookie Invalidation (Max-Age=0)` -> **PASS**
12. `Unauthorized API Access Rejection` -> **PASS**

---

## 3. Supabase Database Security & RLS Audit

### A. Live Probe Results (`scripts/test-supabase.ts`)
A security probe was executed against the live Supabase project instance using the public client credentials:

| Table / Storage | Public Read (SELECT) | Anonymous Insert | Anonymous Update | Anonymous Delete | Status / Vulnerability |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`products`** | Permitted (Expected) | **Permitted** | **Permitted** | **Permitted** | ⚠️ RLS Permissive |
| **`gallery_images`** | Permitted (Expected) | **Permitted** | **Permitted** | **Permitted** | ⚠️ RLS Permissive |
| **`reviews`** | Permitted (Expected) | **Permitted** | **Permitted** | **Permitted** | ⚠️ RLS Permissive |
| **`site_hero`** | Permitted (Expected) | **Permitted** | **Permitted** | **Permitted** | ⚠️ RLS Permissive |
| **`site_instagram`**| Permitted (Expected) | **Permitted** | **Permitted** | **Permitted** | ⚠️ RLS Permissive |
| **`story_images`** | Permitted (Expected) | **Permitted** | **Permitted** | **Permitted** | ⚠️ RLS Permissive |
| **Bucket `products`**| Permitted (Public CDN) | **Blocked (403)**| **Blocked (403)**| **Blocked (403)**|  **Hardened (AccessDenied)** |

### B. Findings Analysis
1. **Public Supabase Key**: The key `NEXT_PUBLIC_SUPABASE_ANON_KEY` is designed to be exposed to client browsers. In Supabase's security model, table authorization must be enforced via PostgreSQL Row Level Security (RLS) policies.
2. **Current RLS State**: The live database tables currently allow anonymous mutations (INSERT/UPDATE/DELETE) because RLS policies are either disabled or configured with `USING (true)`.
3. **Storage Bucket State**: The `products` storage bucket correctly enforces RLS, blocking unauthorized anonymous uploads (HTTP 403 `AccessDenied: new row violates row-level security policy`).

### C. Recommended Remediation Script (`scripts/supabase-security.sql`)
The database administrator must execute `scripts/supabase-security.sql` in the Supabase SQL Editor. This script:
1. Enables Row Level Security on all 6 tables (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`).
2. Creates unrestricted public SELECT policies (`CREATE POLICY "Public Read" ON ... FOR SELECT USING (true)`).
3. Restricts INSERT, UPDATE, and DELETE policies to authenticated service or admin roles (`TO authenticated` or `service_role`).
4. Configures storage bucket policies allowing public GET while restricting uploads to authenticated sessions.

---

## 4. Supply Chain & Dependency Audit (`npm audit`)

### A. Audit Findings
- Total advisories: **51 vulnerabilities** (1 low, 20 moderate, 28 high, 2 critical).
- **Scope**: All 51 vulnerabilities originate exclusively from the `vercel` CLI package (`vercel@56.3.2`) listed under `devDependencies` in `package.json` and its transitive dependencies (`undici`, `tar`, `smol-toml`, `@vercel/backends`, `postcss`).
- **Production Runtime Exposure**: **Zero**.
  - `vercel` CLI is a build/deployment orchestration tool and is not bundled into the production JavaScript application delivered to end users.
  - Runtime code relies on Node.js native `crypto`, Next.js 16 core, and Supabase client.
- **Remediation Strategy**:
  - `npm audit fix --force` was **not executed**, following project rules to prevent breaking framework upgrades to Next.js 16.4 / React 19.
  - When deployment infrastructure upgrades `vercel` CLI in CI/CD, the devDependency will be updated cleanly.
