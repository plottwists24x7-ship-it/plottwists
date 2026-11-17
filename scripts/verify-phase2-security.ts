import module from "module";

// Intercept 'server-only' when executing in standalone Node.js test harness
// (Next.js bundler handles server-only natively via React Server environment condition)
const originalRequire = (module as any).prototype.require;
(module as any).prototype.require = function (id: string) {
  if (id === "server-only") return {};
  return originalRequire.apply(this, arguments as any);
};

import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";
import {
  createSessionToken,
  verifySessionToken,
  ADMIN_COOKIE_NAME,
} from "../src/lib/auth";
import { validateAdminRequest, extractStoragePath } from "../src/lib/admin-guard";
import { GET as publicStoryGet } from "../app/api/story/route";
import { POST as uploadPost } from "../app/api/admin/upload/route";

interface TestReportItem {
  id: number;
  category: string;
  test: string;
  expected: string;
  actual: string;
  pass: boolean;
}

const report: TestReportItem[] = [];
let testCounter = 1;

function assert(
  category: string,
  test: string,
  expected: string,
  actual: string,
  pass: boolean
) {
  report.push({
    id: testCounter++,
    category,
    test,
    expected,
    actual,
    pass,
  });
}

async function runSecuritySuite() {
  console.log("==================================================================");
  console.log("   PLOTTWIST STAGE D PHASE 2: SECURITY & BACKEND TEST SUITE       ");
  console.log("==================================================================\n");

  // Ensure test environment credentials
  process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "test_admin_secret_pass_123";
  process.env.ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "test_session_secret_at_least_32_bytes_long!";
  process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jskpspkbixqyhacimrdz.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key";

  // ─────────────────────────────────────────────────────────
  // TEST 1: AUTHENTICATION & CRYPTOGRAPHIC TOKEN VERIFICATION
  // ─────────────────────────────────────────────────────────
  const validToken = await createSessionToken(3600);
  const isValid = await verifySessionToken(validToken);
  assert("Auth", "Valid session token verifies successfully", "true", String(isValid), isValid === true);

  const expiredToken = await createSessionToken(-10);
  const isExpiredValid = await verifySessionToken(expiredToken);
  assert("Auth", "Expired session token is rejected", "false", String(isExpiredValid), isExpiredValid === false);

  const tamperedToken = validToken.slice(0, -6) + "xxxxxx";
  const isTamperedValid = await verifySessionToken(tamperedToken);
  assert("Auth", "Tampered signature session token is rejected", "false", String(isTamperedValid), isTamperedValid === false);

  const malformedToken = "invalid-token-without-period";
  const isMalformedValid = await verifySessionToken(malformedToken);
  assert("Auth", "Malformed token is rejected", "false", String(isMalformedValid), isMalformedValid === false);

  // ─────────────────────────────────────────────────────────
  // TEST 2: ADMIN GUARD & CSRF PROTECTION
  // ─────────────────────────────────────────────────────────
  // 2.1 Request with no cookie -> 401
  const reqNoCookie = new NextRequest("http://localhost:3000/api/admin/products", {
    method: "POST",
    headers: { host: "localhost:3000", origin: "http://localhost:3000" },
  });
  const resNoCookie = await validateAdminRequest(reqNoCookie);
  assert(
    "Guard",
    "Missing session cookie returns 401 Unauthorized",
    "401",
    String(resNoCookie.response?.status),
    !resNoCookie.authorized && resNoCookie.response?.status === 401
  );

  // 2.2 Request with invalid cookie -> 401
  const reqBadCookie = new NextRequest("http://localhost:3000/api/admin/products", {
    method: "POST",
    headers: {
      host: "localhost:3000",
      origin: "http://localhost:3000",
      cookie: `${ADMIN_COOKIE_NAME}=forged.token.here`,
    },
  });
  const resBadCookie = await validateAdminRequest(reqBadCookie);
  assert(
    "Guard",
    "Forged session cookie returns 401 Unauthorized",
    "401",
    String(resBadCookie.response?.status),
    !resBadCookie.authorized && resBadCookie.response?.status === 401
  );

  // 2.3 Mutation request with valid cookie but mismatched Origin -> 403
  const reqCsrf = new NextRequest("http://localhost:3000/api/admin/products", {
    method: "POST",
    headers: {
      host: "localhost:3000",
      origin: "https://malicious-cross-origin.com",
      cookie: `${ADMIN_COOKIE_NAME}=${validToken}`,
    },
  });
  const resCsrf = await validateAdminRequest(reqCsrf);
  assert(
    "CSRF",
    "Cross-origin mutation request rejected with 403 Forbidden",
    "403",
    String(resCsrf.response?.status),
    !resCsrf.authorized && resCsrf.response?.status === 403
  );

  // 2.4 Mutation request with valid cookie and missing Origin/Referer -> 403
  const reqNoOrigin = new NextRequest("http://localhost:3000/api/admin/products", {
    method: "POST",
    headers: {
      host: "localhost:3000",
      cookie: `${ADMIN_COOKIE_NAME}=${validToken}`,
    },
  });
  const resNoOrigin = await validateAdminRequest(reqNoOrigin);
  assert(
    "CSRF",
    "Missing Origin/Referer mutation rejected with 403 Forbidden",
    "403",
    String(resNoOrigin.response?.status),
    !resNoOrigin.authorized && resNoOrigin.response?.status === 403
  );

  // 2.5 Mutation request with valid cookie and matching Origin -> Authorized
  const reqValidMutation = new NextRequest("http://localhost:3000/api/admin/products", {
    method: "POST",
    headers: {
      host: "localhost:3000",
      origin: "http://localhost:3000",
      cookie: `${ADMIN_COOKIE_NAME}=${validToken}`,
    },
  });
  const resValidMutation = await validateAdminRequest(reqValidMutation);
  assert(
    "CSRF",
    "Valid session + matching Origin is authorized",
    "true",
    String(resValidMutation.authorized),
    resValidMutation.authorized === true
  );

  // ─────────────────────────────────────────────────────────
  // TEST 3: STORAGE UPLOAD VALIDATION & SECURITY GATES
  // ─────────────────────────────────────────────────────────
  // 3.1 Upload rejected when not authenticated
  const reqUploadNoAuth = new NextRequest("http://localhost:3000/api/admin/upload", {
    method: "POST",
    headers: { host: "localhost:3000", origin: "http://localhost:3000" },
  });
  const resUploadNoAuth = await uploadPost(reqUploadNoAuth);
  assert(
    "Storage",
    "POST /api/admin/upload without session rejected with 401",
    "401",
    String(resUploadNoAuth.status),
    resUploadNoAuth.status === 401
  );

  // 3.2 Upload with invalid MIME type (e.g. image/svg+xml)
  const svgBlob = new Blob(["<svg></svg>"], { type: "image/svg+xml" });
  const formSvg = new FormData();
  formSvg.append("file", svgBlob, "graphic.svg");
  formSvg.append("folder", "products");

  const reqUploadSvg = new NextRequest("http://localhost:3000/api/admin/upload", {
    method: "POST",
    headers: {
      host: "localhost:3000",
      origin: "http://localhost:3000",
      cookie: `${ADMIN_COOKIE_NAME}=${validToken}`,
    },
    body: formSvg,
  });
  const resUploadSvg = await uploadPost(reqUploadSvg);
  assert(
    "Storage",
    "SVG file upload rejected with 400 Bad Request",
    "400",
    String(resUploadSvg.status),
    resUploadSvg.status === 400
  );

  // 3.3 Upload with invalid folder (path traversal attempt)
  const formBadFolder = new FormData();
  formBadFolder.append("file", new Blob([new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0])], { type: "image/jpeg" }), "photo.jpg");
  formBadFolder.append("folder", "../../../etc");

  const reqUploadBadFolder = new NextRequest("http://localhost:3000/api/admin/upload", {
    method: "POST",
    headers: {
      host: "localhost:3000",
      origin: "http://localhost:3000",
      cookie: `${ADMIN_COOKIE_NAME}=${validToken}`,
    },
    body: formBadFolder,
  });
  const resUploadBadFolder = await uploadPost(reqUploadBadFolder);
  assert(
    "Storage",
    "Disallowed folder / traversal attempt rejected with 400 Bad Request",
    "400",
    String(resUploadBadFolder.status),
    resUploadBadFolder.status === 400
  );

  // 3.4 Upload spoofed file (reported as image/jpeg but content is plain text)
  const formSpoofed = new FormData();
  formSpoofed.append("file", new Blob(["NOT_A_REAL_JPEG_IMAGE_BYTES"], { type: "image/jpeg" }), "spoofed.jpg");
  formSpoofed.append("folder", "products");

  const reqUploadSpoofed = new NextRequest("http://localhost:3000/api/admin/upload", {
    method: "POST",
    headers: {
      host: "localhost:3000",
      origin: "http://localhost:3000",
      cookie: `${ADMIN_COOKIE_NAME}=${validToken}`,
    },
    body: formSpoofed,
  });
  const resUploadSpoofed = await uploadPost(reqUploadSpoofed);
  assert(
    "Storage",
    "Spoofed JPEG with invalid magic bytes rejected with 400 Bad Request",
    "400",
    String(resUploadSpoofed.status),
    resUploadSpoofed.status === 400
  );

  // 3.5 Upload file exceeding 5 MB limit
  const largeBuffer = new Uint8Array(6 * 1024 * 1024); // 6 MB
  largeBuffer[0] = 0xff;
  largeBuffer[1] = 0xd8;
  largeBuffer[2] = 0xff;
  const formLarge = new FormData();
  formLarge.append("file", new Blob([largeBuffer], { type: "image/jpeg" }), "large.jpg");
  formLarge.append("folder", "products");

  const reqUploadLarge = new NextRequest("http://localhost:3000/api/admin/upload", {
    method: "POST",
    headers: {
      host: "localhost:3000",
      origin: "http://localhost:3000",
      cookie: `${ADMIN_COOKIE_NAME}=${validToken}`,
    },
    body: formLarge,
  });
  const resUploadLarge = await uploadPost(reqUploadLarge);
  assert(
    "Storage",
    "File exceeding 5 MB limit rejected with 400 Bad Request",
    "400",
    String(resUploadLarge.status),
    resUploadLarge.status === 400
  );

  // ─────────────────────────────────────────────────────────
  // TEST 4: STORAGE PATH EXTRACTION & CLEANUP SAFETY
  // ─────────────────────────────────────────────────────────
  const localAsset = "/images/baker-where/prod_chocolate_cookies.jpg";
  const extractedLocal = extractStoragePath(localAsset);
  assert(
    "Storage",
    "Local static asset path returns null (never deleted)",
    "null",
    String(extractedLocal),
    extractedLocal === null
  );

  const specialHero = "/cheesecake.png";
  const extractedHero = extractStoragePath(specialHero);
  assert(
    "Storage",
    "Special hero local asset returns null (never deleted)",
    "null",
    String(extractedHero),
    extractedHero === null
  );

  const dynamicRemoteUrl = "https://jskpspkbixqyhacimrdz.supabase.co/storage/v1/object/public/products/products/1715000000-uuid.jpg";
  const extractedRemote = extractStoragePath(dynamicRemoteUrl);
  assert(
    "Storage",
    "Dynamic storage URL extracts correct relative key",
    "products/1715000000-uuid.jpg",
    String(extractedRemote),
    extractedRemote === "products/1715000000-uuid.jpg"
  );

  const relativeStoragePath = "hero/1715000000-custom.webp";
  const extractedRelative = extractStoragePath(relativeStoragePath);
  assert(
    "Storage",
    "Relative storage path preserved for cleanup",
    "hero/1715000000-custom.webp",
    String(extractedRelative),
    extractedRelative === "hero/1715000000-custom.webp"
  );

  // ─────────────────────────────────────────────────────────
  // TEST 5: PUBLIC STOREFRONT API (NO SESSION REQUIRED)
  // ─────────────────────────────────────────────────────────
  try {
    const publicStoryRes = await publicStoryGet();
    const publicStoryJson = await publicStoryRes.json();
    assert(
      "Public API",
      "GET /api/story succeeds without admin session",
      "200",
      String(publicStoryRes.status),
      publicStoryRes.status === 200 && Boolean(publicStoryJson.title)
    );
  } catch (err: any) {
    assert("Public API", "GET /api/story succeeds without admin session", "200", err.message, false);
  }

  // ─────────────────────────────────────────────────────────
  // TEST 6: CLIENT BUNDLE SECRETS LEAK AUDIT
  // ─────────────────────────────────────────────────────────
  const nextStaticDir = path.join(process.cwd(), ".next", "static");
  let foundSecretLeak = false;
  let searchedFilesCount = 0;

  if (fs.existsSync(nextStaticDir)) {
    const scanDir = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith(".js") || entry.name.endsWith(".json"))) {
          searchedFilesCount++;
          const content = fs.readFileSync(fullPath, "utf-8");
          if (
            content.includes("SUPABASE_SERVICE_ROLE_KEY") ||
            content.includes("service_role") ||
            content.includes("ADMIN_SESSION_SECRET")
          ) {
            foundSecretLeak = true;
          }
        }
      }
    };
    scanDir(nextStaticDir);
  }

  assert(
    "Bundle Audit",
    `Zero service-role or session secrets leaked in .next/static client bundles (${searchedFilesCount} files scanned)`,
    "false",
    String(foundSecretLeak),
    foundSecretLeak === false && searchedFilesCount > 0
  );

  // ─────────────────────────────────────────────────────────
  // PRINT SUMMARY REPORT
  // ─────────────────────────────────────────────────────────
  console.log("\n=================== VERIFICATION RESULTS ===================");
  let passedCount = 0;
  for (const item of report) {
    const tag = item.pass ? "✅ PASS" : "❌ FAIL";
    if (item.pass) passedCount++;
    console.log(
      `[${item.id.toString().padStart(2, "0")}] ${tag} | ${item.category.padEnd(12)} | ${item.test}`
    );
    if (!item.pass) {
      console.log(`     Expected: ${item.expected}`);
      console.log(`     Actual:   ${item.actual}`);
    }
  }

  console.log(`\nSummary: ${passedCount} / ${report.length} tests passed.`);
  if (passedCount === report.length) {
    console.log("🎉 ALL PHASE 2 SECURITY CHECKS PASSED PERFECTLY!");
  } else {
    console.error("⚠️ Some tests failed. Please investigate before proceeding.");
    process.exit(1);
  }
}

runSecuritySuite().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
