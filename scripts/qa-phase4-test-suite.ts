import fs from "fs";
import path from "path";

// Load .env.local for credentials
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx > 0) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

interface QATestResult {
  id: number;
  category: string;
  name: string;
  expected: string;
  actual: string;
  passed: boolean;
}

const results: QATestResult[] = [];
let testId = 1;

function recordTest(category: string, name: string, expected: string, actual: string, passed: boolean) {
  results.push({
    id: testId++,
    category,
    name,
    expected,
    actual,
    passed,
  });
}

const BASE_URL = "http://localhost:3000";

async function runQASuite() {
  console.log("==================================================================");
  console.log("   PLOTTWIST STAGE D PHASE 4: LOCAL QA & REGRESSION TEST SUITE    ");
  console.log("==================================================================\n");

  // ──────────────────────────────────────────────────────────────────────────
  // 1. ENVIRONMENT CONFIGURATION VERIFICATION
  // ──────────────────────────────────────────────────────────────────────────
  console.log("--- Section 1: Environment Configuration Audit ---");
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const pubKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const adminPass = process.env.ADMIN_PASSWORD || "";
  const sessionSecret = process.env.ADMIN_SESSION_SECRET || "";

  // 1.1 URL validation
  const isUrlValid = Boolean(rawUrl) && !rawUrl.includes("/rest/v1") && !rawUrl.endsWith("/");
  recordTest(
    "Environment",
    "NEXT_PUBLIC_SUPABASE_URL is project root without /rest/v1 or trailing slash",
    "Valid root URL",
    isUrlValid ? "Valid root URL" : `Invalid URL: ${rawUrl}`,
    isUrlValid
  );

  // 1.2 Publishable key present
  recordTest(
    "Environment",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is configured",
    "Present",
    pubKey ? "Present" : "Missing",
    Boolean(pubKey)
  );

  // 1.3 Service role key report (never fail, accurately report status)
  recordTest(
    "Environment",
    "SUPABASE_SERVICE_ROLE_KEY status check",
    "Reported accurately",
    serviceKey ? "Present locally" : "Not configured locally (Server-side production only)",
    true
  );

  // 1.4 Admin credentials configured
  recordTest(
    "Environment",
    "ADMIN_PASSWORD and ADMIN_SESSION_SECRET configured",
    "Configured",
    adminPass && sessionSecret ? "Configured" : "Missing",
    Boolean(adminPass && sessionSecret)
  );

  // ──────────────────────────────────────────────────────────────────────────
  // 2. PUBLIC STOREFRONT CONTENT & STATIC ASSET TESTING
  // ──────────────────────────────────────────────────────────────────────────
  console.log("--- Section 2: Public Storefront & Asset Verification ---");

  // 2.1 Fetch Homepage HTML
  let homeHtml = "";
  let homeStatus = 0;
  try {
    const res = await fetch(`${BASE_URL}/`);
    homeStatus = res.status;
    homeHtml = await res.text();
  } catch (e: any) {
    console.error("Failed to connect to local server:", e.message);
  }

  recordTest(
    "Storefront",
    "GET / returns HTTP 200 OK",
    "200",
    String(homeStatus),
    homeStatus === 200
  );

  // 2.2 Hero section checks
  const heroFound = homeHtml.includes("Signature Artisanal Cheesecake") || homeHtml.includes("cheesecake.png");
  recordTest(
    "Storefront",
    "Hero section contains signature cheesecake polaroid reference",
    "true",
    String(heroFound),
    heroFound
  );

  // 2.3 Story section checks
  const storyFound = homeHtml.includes("ABOUT OUR BAKERY") || homeHtml.includes("PLOTTWIST24X7");
  recordTest(
    "Storefront",
    "Story section renders verified editorial headline PLOTTWIST24X7",
    "true",
    String(storyFound),
    storyFound
  );

  // 2.4 Faves section checks (01 Muffins, 02 Cookies, 03 Mocha Oreo, 04 Tiramisu)
  const favesMuffins = homeHtml.includes("Muffins") || homeHtml.includes("muffins");
  const favesCookies = homeHtml.includes("Cookies") || homeHtml.includes("cookies");
  const favesTiramisu = homeHtml.includes("Tiramisu") || homeHtml.includes("tiramisu");
  const allFavesPresent = favesMuffins && favesCookies && favesTiramisu;
  recordTest(
    "Storefront",
    "Faves section includes canonical bestsellers (Muffins, Cookies, Tiramisu)",
    "true",
    String(allFavesPresent),
    allFavesPresent
  );

  // 2.5 Static Menu section checks (Boxes, Brookie, Tres leches from static catalog)
  const menuFound = homeHtml.includes("BOXES") && (homeHtml.includes("Brookie") || homeHtml.includes("brookie"));
  recordTest(
    "Storefront",
    "Menu section renders static catalog (BOXES, Brookie) without modifications",
    "true",
    String(menuFound),
    menuFound
  );

  // 2.6 Reviews empty-state checks (Zero mock reviews)
  const hasEmptyState = homeHtml.includes("Reviews Coming Soon") || homeHtml.includes("Fresh From Our Oven");
  const hasNoFakeNames = !homeHtml.includes("Oliver Bennett") && !homeHtml.includes("Sophia Martinez");
  recordTest(
    "Storefront",
    "Reviews section displays authentic empty state without fabricated testimonials",
    "Empty state without mock names",
    hasEmptyState && hasNoFakeNames ? "Empty state without mock names" : "Found mock data or missing empty state",
    hasEmptyState && hasNoFakeNames
  );

  // 2.7 Instagram CTA section checks
  const igFound = homeHtml.includes("@plottwist24x") && homeHtml.includes("instagram.com");
  recordTest(
    "Storefront",
    "Instagram CTA section displays handle @plottwist24x and valid link",
    "true",
    String(igFound),
    igFound
  );

  // 2.8 Public Story API
  let storyApiStatus = 0;
  let storyApiValid = false;
  try {
    const sRes = await fetch(`${BASE_URL}/api/story`);
    storyApiStatus = sRes.status;
    const sJson = await sRes.json();
    storyApiValid = Boolean(sJson.title && sJson.image && Array.isArray(sJson.badges));
  } catch {}
  recordTest(
    "Storefront",
    "GET /api/story returns 200 with complete story metadata",
    "200 with valid JSON",
    `${storyApiStatus} (valid: ${storyApiValid})`,
    storyApiStatus === 200 && storyApiValid
  );

  // 2.9 Static Image Assets Check
  const imagesToCheck = [
    "/cheesecake.png",
    "/images/baker-where/hero_bakery.jpg",
    "/images/baker-where/prod_pancakes.jpg",
    "/images/baker-where/prod_tiramisu.jpg",
    "/images/baker-where/prod_biscoff_brownie.jpg",
    "/images/baker-where/instagram_cta_dessert.jpg",
    "/images/baker-where/prod_chocolate_cookies.jpg",
  ];

  let missingImagesCount = 0;
  for (const imgPath of imagesToCheck) {
    try {
      const res = await fetch(`${BASE_URL}${imgPath}`, { method: "HEAD" });
      if (res.status !== 200) {
        missingImagesCount++;
        console.warn(`   ⚠️ Asset ${imgPath} returned status ${res.status}`);
      }
    } catch {
      missingImagesCount++;
    }
  }

  recordTest(
    "Storefront",
    "All essential storefront local image assets return HTTP 200 OK",
    "0 missing",
    `${missingImagesCount} missing`,
    missingImagesCount === 0
  );

  // ──────────────────────────────────────────────────────────────────────────
  // 3. ADMIN AUTHENTICATION, MIDDLEWARE & ROUTE PROTECTION
  // ──────────────────────────────────────────────────────────────────────────
  console.log("--- Section 3: Admin Authentication & Protection Testing ---");

  // 3.1 Direct access to /admin without session -> redirect to /admin/login
  const adminRes = await fetch(`${BASE_URL}/admin`, { redirect: "manual" });
  const isRedirectToLogin =
    [307, 308, 302, 303].includes(adminRes.status) &&
    (adminRes.headers.get("location") || "").includes("/admin/login");
  recordTest(
    "Auth & Proxy",
    "Unauthenticated request to /admin redirects to /admin/login",
    "Redirect to /admin/login",
    `Status ${adminRes.status}, location: ${adminRes.headers.get("location")}`,
    isRedirectToLogin
  );

  // 3.2 Direct access to /admin/bakes without session -> redirect to /admin/login
  const bakesRes = await fetch(`${BASE_URL}/admin/bakes`, { redirect: "manual" });
  const isBakesRedirect =
    [307, 308, 302, 303].includes(bakesRes.status) &&
    (bakesRes.headers.get("location") || "").includes("/admin/login");
  recordTest(
    "Auth & Proxy",
    "Unauthenticated request to /admin/bakes redirects to /admin/login",
    "Redirect to /admin/login",
    `Status ${bakesRes.status}`,
    isBakesRedirect
  );

  // 3.3 Direct access to /admin/gallery -> redirects to /admin/dashboard (or /admin/login if unauthenticated)
  const galleryRes = await fetch(`${BASE_URL}/admin/gallery`, { redirect: "manual" });
  const isGalleryRedirect = [307, 308, 302, 303].includes(galleryRes.status);
  recordTest(
    "Auth & Proxy",
    "Legacy /admin/gallery route redirects safely without 404",
    "307/308 Redirect",
    `Status ${galleryRes.status}, location: ${galleryRes.headers.get("location")}`,
    isGalleryRedirect
  );

  // 3.4 Login with invalid password -> 401
  const badLoginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: "wrong_password_123" }),
  });
  recordTest(
    "Auth API",
    "POST /api/admin/login with incorrect password returns 401 Unauthorized",
    "401",
    String(badLoginRes.status),
    badLoginRes.status === 401
  );

  // 3.5 Login with valid password -> 200 + sets HttpOnly admin_session cookie
  const goodLoginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: adminPass }),
  });

  const setCookieHeader = goodLoginRes.headers.get("set-cookie") || "";
  const hasAdminCookie = setCookieHeader.includes("admin_session=");
  const isHttpOnly = setCookieHeader.toLowerCase().includes("httponly");
  const isSameSiteLax = setCookieHeader.toLowerCase().includes("samesite=lax");

  recordTest(
    "Auth API",
    "POST /api/admin/login with correct password returns 200 + secure HttpOnly cookie",
    "200 with HttpOnly SameSite=Lax cookie",
    `${goodLoginRes.status} (cookie: ${hasAdminCookie}, httpOnly: ${isHttpOnly}, lax: ${isSameSiteLax})`,
    goodLoginRes.status === 200 && hasAdminCookie && isHttpOnly && isSameSiteLax
  );

  // Extract session token from cookie
  const matchCookie = setCookieHeader.match(/admin_session=([^;]+)/);
  const sessionToken = matchCookie ? matchCookie[1] : "";

  // 3.6 Session check with valid cookie -> 200 authenticated: true
  const sessionCheckRes = await fetch(`${BASE_URL}/api/admin/session`, {
    headers: { Cookie: `admin_session=${sessionToken}` },
  });
  const sessionCheckJson = await sessionCheckRes.json().catch(() => ({}));
  recordTest(
    "Auth API",
    "GET /api/admin/session with valid token returns authenticated: true",
    "200 { authenticated: true }",
    `${sessionCheckRes.status} ${JSON.stringify(sessionCheckJson)}`,
    sessionCheckRes.status === 200 && sessionCheckJson.authenticated === true
  );

  // 3.7 Session check without cookie -> 401
  const noSessionRes = await fetch(`${BASE_URL}/api/admin/session`);
  recordTest(
    "Auth API",
    "GET /api/admin/session without cookie returns 401",
    "401",
    String(noSessionRes.status),
    noSessionRes.status === 401
  );

  // 3.8 Logout -> clears cookie
  const logoutRes = await fetch(`${BASE_URL}/api/admin/logout`, {
    method: "POST",
    headers: { Cookie: `admin_session=${sessionToken}` },
  });
  const rawSetCookie = (logoutRes.headers as any).getSetCookie
    ? (logoutRes.headers as any).getSetCookie().join("; ")
    : logoutRes.headers.get("set-cookie") || "";

  const isCookieCleared =
    rawSetCookie.toLowerCase().includes("max-age=0") ||
    rawSetCookie.toLowerCase().includes("expires=") ||
    rawSetCookie.includes("admin_session=;");

  recordTest(
    "Auth API",
    "POST /api/admin/logout invalidates admin_session cookie (max-age=0)",
    "Cookie invalidated",
    isCookieCleared ? "Cookie invalidated" : `Header: "${rawSetCookie}"`,
    isCookieCleared
  );

  // ──────────────────────────────────────────────────────────────────────────
  // 4. PROTECTED API DIRECT ACCESS & CSRF ENFORCEMENT
  // ──────────────────────────────────────────────────────────────────────────
  console.log("--- Section 4: Protected API Security Gates & CSRF ---");

  const protectedEndpoints = [
    { method: "POST", path: "/api/admin/products" },
    { method: "PATCH", path: "/api/admin/products" },
    { method: "DELETE", path: "/api/admin/products" },
    { method: "POST", path: "/api/admin/reviews" },
    { method: "PATCH", path: "/api/admin/reviews" },
    { method: "DELETE", path: "/api/admin/reviews" },
    { method: "PATCH", path: "/api/admin/hero" },
    { method: "PATCH", path: "/api/admin/story" },
    { method: "PATCH", path: "/api/admin/instagram" },
    { method: "POST", path: "/api/admin/upload" },
  ];

  let unauthBlockedCount = 0;
  for (const ep of protectedEndpoints) {
    const res = await fetch(`${BASE_URL}${ep.path}`, {
      method: ep.method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (res.status === 401) {
      unauthBlockedCount++;
    } else {
      console.warn(`   ⚠️ ${ep.method} ${ep.path} returned ${res.status} instead of 401`);
    }
  }

  recordTest(
    "Security Gates",
    `All ${protectedEndpoints.length} mutation routes reject unauthenticated calls with 401`,
    `${protectedEndpoints.length} blocked`,
    `${unauthBlockedCount} blocked`,
    unauthBlockedCount === protectedEndpoints.length
  );

  // 4.2 Cross-Origin Mutation Request with valid cookie -> 403 Forbidden
  const csrfRes = await fetch(`${BASE_URL}/api/admin/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `admin_session=${sessionToken}`,
      Origin: "https://malicious-attacker-site.com",
    },
    body: JSON.stringify({ name: "Hacked Item" }),
  });

  recordTest(
    "CSRF Defense",
    "Cross-origin POST request with mismatched Origin header rejected with 403 Forbidden",
    "403",
    String(csrfRes.status),
    csrfRes.status === 403
  );

  // 4.3 Missing Origin header on mutation request -> 403 Forbidden
  const noOriginRes = await fetch(`${BASE_URL}/api/admin/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `admin_session=${sessionToken}`,
    },
    body: JSON.stringify({ name: "Hacked Item" }),
  });

  recordTest(
    "CSRF Defense",
    "Mutation request lacking Origin and Referer rejected with 403 Forbidden",
    "403",
    String(noOriginRes.status),
    noOriginRes.status === 403
  );

  // ──────────────────────────────────────────────────────────────────────────
  // 5. STORAGE UPLOAD SECURITY GATES
  // ──────────────────────────────────────────────────────────────────────────
  console.log("--- Section 5: Storage Upload Security Gate Verification ---");

  // 5.1 Reject SVG uploads
  const svgForm = new FormData();
  svgForm.append("file", new Blob(["<svg></svg>"], { type: "image/svg+xml" }), "vector.svg");
  svgForm.append("folder", "products");

  const svgRes = await fetch(`${BASE_URL}/api/admin/upload`, {
    method: "POST",
    headers: {
      Cookie: `admin_session=${sessionToken}`,
      Origin: "http://localhost:3000",
    },
    body: svgForm,
  });

  recordTest(
    "Storage Security",
    "SVG file upload rejected with 400 Bad Request",
    "400",
    String(svgRes.status),
    svgRes.status === 400
  );

  // 5.2 Reject Disallowed folder (path traversal)
  const traversalForm = new FormData();
  traversalForm.append("file", new Blob([new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0])], { type: "image/jpeg" }), "photo.jpg");
  traversalForm.append("folder", "../../../system");

  const traversalRes = await fetch(`${BASE_URL}/api/admin/upload`, {
    method: "POST",
    headers: {
      Cookie: `admin_session=${sessionToken}`,
      Origin: "http://localhost:3000",
    },
    body: traversalForm,
  });

  recordTest(
    "Storage Security",
    "Folder path traversal attempt rejected with 400 Bad Request",
    "400",
    String(traversalRes.status),
    traversalRes.status === 400
  );

  // 5.3 Reject Spoofed JPEG magic bytes
  const spoofedForm = new FormData();
  spoofedForm.append("file", new Blob(["NOT_ACTUAL_IMAGE_HEADER"], { type: "image/jpeg" }), "spoofed.jpg");
  spoofedForm.append("folder", "products");

  const spoofedRes = await fetch(`${BASE_URL}/api/admin/upload`, {
    method: "POST",
    headers: {
      Cookie: `admin_session=${sessionToken}`,
      Origin: "http://localhost:3000",
    },
    body: spoofedForm,
  });

  recordTest(
    "Storage Security",
    "Spoofed JPEG with invalid magic bytes rejected with 400 Bad Request",
    "400",
    String(spoofedRes.status),
    spoofedRes.status === 400
  );

  // 5.4 Reject File exceeding 5 MB limit
  const bigBuffer = new Uint8Array(6 * 1024 * 1024);
  bigBuffer[0] = 0xff;
  bigBuffer[1] = 0xd8;
  bigBuffer[2] = 0xff;
  const bigForm = new FormData();
  bigForm.append("file", new Blob([bigBuffer], { type: "image/jpeg" }), "oversized.jpg");
  bigForm.append("folder", "products");

  const bigRes = await fetch(`${BASE_URL}/api/admin/upload`, {
    method: "POST",
    headers: {
      Cookie: `admin_session=${sessionToken}`,
      Origin: "http://localhost:3000",
    },
    body: bigForm,
  });

  recordTest(
    "Storage Security",
    "File exceeding 5 MB size limit rejected with 400 Bad Request",
    "400",
    String(bigRes.status),
    bigRes.status === 400
  );

  // ──────────────────────────────────────────────────────────────────────────
  // 6. CLIENT BUNDLE SECRETS LEAK AUDIT
  // ──────────────────────────────────────────────────────────────────────────
  console.log("--- Section 6: Client Bundle Secrets Leak Audit ---");
  const nextStaticDir = path.join(process.cwd(), ".next", "static");
  let leakedCount = 0;
  let scannedFilesCount = 0;

  if (fs.existsSync(nextStaticDir)) {
    const scanDir = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith(".js") || entry.name.endsWith(".json"))) {
          scannedFilesCount++;
          const code = fs.readFileSync(fullPath, "utf-8");
          if (
            code.includes("SUPABASE_SERVICE_ROLE_KEY") ||
            code.includes("service_role") ||
            code.includes("ADMIN_SESSION_SECRET")
          ) {
            leakedCount++;
            console.warn(`   ⚠️ Potential secret leak found in: ${entry.name}`);
          }
        }
      }
    };
    scanDir(nextStaticDir);
  }

  recordTest(
    "Bundle Audit",
    `Zero private secrets found across ${scannedFilesCount} compiled client JS bundles in .next/static`,
    "0 leaked",
    `${leakedCount} leaked`,
    leakedCount === 0 && scannedFilesCount > 0
  );

  // ──────────────────────────────────────────────────────────────────────────
  // PRINT SUMMARY REPORT
  // ──────────────────────────────────────────────────────────────────────────
  console.log("\n=================== QA TEST SUITE EXECUTION SUMMARY ===================");
  let passCount = 0;
  for (const r of results) {
    const statusTag = r.passed ? "✅ PASS" : "❌ FAIL";
    if (r.passed) passCount++;
    console.log(`[${String(r.id).padStart(2, "0")}] ${statusTag} | ${r.category.padEnd(16)} | ${r.name}`);
    if (!r.passed) {
      console.log(`     Expected: ${r.expected}`);
      console.log(`     Actual:   ${r.actual}`);
    }
  }

  console.log(`\nOverall Result: ${passCount} / ${results.length} tests passed.`);
  if (passCount === results.length) {
    console.log("🎉 ALL LOCAL QA AND REGRESSION CHECKS PASSED!");
  } else {
    console.error("⚠️ Some QA tests failed. Please investigate before deployment.");
    process.exit(1);
  }
}

runQASuite().catch((err) => {
  console.error("Fatal error running QA suite:", err);
  process.exit(1);
});
