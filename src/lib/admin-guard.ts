import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "./auth";

export interface AdminAuthResult {
  authorized: boolean;
  response?: NextResponse;
}

/**
 * Validates admin request authentication and CSRF protection for sensitive API routes.
 *
 * Security Guarantees:
 * 1. Checks and cryptographically verifies the HttpOnly admin_session cookie using HMAC-SHA256.
 * 2. Enforces expiration and fails closed if token is missing, expired, or invalid (HTTP 401).
 * 3. Enforces Origin/Referer CSRF protection on state-modifying requests (POST, PATCH, DELETE, PUT) (HTTP 403).
 */
export async function validateAdminRequest(
  req: NextRequest,
  options: { checkCsrf?: boolean } = { checkCsrf: true }
): Promise<AdminAuthResult> {
  // 1. Session Verification
  const sessionCookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isValidSession = await verifySessionToken(sessionCookie);

  if (!isValidSession) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Valid admin session required.",
        },
        { status: 401 }
      ),
    };
  }

  // 2. CSRF Verification for state-changing HTTP methods
  const isMutation = ["POST", "PATCH", "DELETE", "PUT"].includes(
    req.method.toUpperCase()
  );

  if (isMutation && options.checkCsrf !== false) {
    const origin = req.headers.get("origin");
    const referer = req.headers.get("referer");

    let sourceHostname: string | null = null;

    if (origin) {
      try {
        sourceHostname = new URL(origin).hostname.toLowerCase();
      } catch {
        return {
          authorized: false,
          response: NextResponse.json(
            { success: false, error: "Forbidden: Malformed Origin header." },
            { status: 403 }
          ),
        };
      }
    } else if (referer) {
      try {
        sourceHostname = new URL(referer).hostname.toLowerCase();
      } catch {
        return {
          authorized: false,
          response: NextResponse.json(
            { success: false, error: "Forbidden: Malformed Referer header." },
            { status: 403 }
          ),
        };
      }
    }

    // If neither origin nor referer is provided on a mutation, reject
    if (!sourceHostname) {
      return {
        authorized: false,
        response: NextResponse.json(
          {
            success: false,
            error:
              "Forbidden: Origin or Referer header required for state-changing requests.",
          },
          { status: 403 }
        ),
      };
    }

    // Expected target hostnames
    const expectedHostnames = new Set<string>();

    // 1. Next.js internal parsed request hostname
    if (req.nextUrl.hostname) {
      expectedHostnames.add(req.nextUrl.hostname.toLowerCase());
    }

    // 2. HTTP Host header (without port)
    const hostHeader = req.headers.get("host");
    if (hostHeader) {
      const cleanHost = hostHeader.split(":")[0].trim().toLowerCase();
      if (cleanHost) expectedHostnames.add(cleanHost);
    }

    // 3. X-Forwarded-Host header (Vercel edge proxy - take primary client host, without port)
    const xForwardedHost = req.headers.get("x-forwarded-host");
    if (xForwardedHost) {
      const primaryForwardedHost = xForwardedHost
        .split(",")[0]
        .trim()
        .split(":")[0]
        .trim()
        .toLowerCase();
      if (primaryForwardedHost) expectedHostnames.add(primaryForwardedHost);
    }

    // 4. Vercel deployment environment variables (if set)
    if (process.env.VERCEL_URL) {
      expectedHostnames.add(
        process.env.VERCEL_URL.split(":")[0].trim().toLowerCase()
      );
    }
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      expectedHostnames.add(
        process.env.VERCEL_PROJECT_PRODUCTION_URL.split(":")[0].trim().toLowerCase()
      );
    }

    // Allow local loopback in development / test
    if (
      sourceHostname === "localhost" ||
      sourceHostname === "127.0.0.1" ||
      sourceHostname === "::1"
    ) {
      expectedHostnames.add("localhost");
      expectedHostnames.add("127.0.0.1");
      expectedHostnames.add("::1");
    }

    if (!expectedHostnames.has(sourceHostname)) {
      return {
        authorized: false,
        response: NextResponse.json(
          {
            success: false,
            error: "Forbidden: Cross-site request forgery detected.",
          },
          { status: 403 }
        ),
      };
    }
  }

  return { authorized: true };
}

/**
 * Helper to safely extract a storage object key from a full public URL or relative path.
 * Returns null if the path is a local static asset (e.g. /images/... or /cheesecake.png)
 * which should never be deleted from Supabase Storage.
 */
export function extractStoragePath(
  imagePathOrUrl?: string | null,
  bucketName: string = "products"
): string | null {
  if (!imagePathOrUrl || typeof imagePathOrUrl !== "string") {
    return null;
  }

  const trimmed = imagePathOrUrl.trim();

  // Local static files and data URLs must never be deleted
  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return null;
  }

  // Sample static paths under public/images/baker-where/
  if (
    /^(gallery|instagram|story|products)\/(prod_|gallery_|hero_|instagram_|bakery_|coffee_|story_)/.test(
      trimmed
    )
  ) {
    return null;
  }

  // If it's a full Supabase public URL: .../storage/v1/object/public/<bucketName>/<objectPath>
  const urlPattern = new RegExp(
    `/storage/v1/object/public/${bucketName}/(.+)$`,
    "i"
  );
  const match = trimmed.match(urlPattern);
  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  }

  // If it's a relative storage path (e.g. "products/123-abc.jpg" or "hero/456.webp")
  if (/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Checks whether two image references (relative storage paths, full Supabase public URLs,
 * or static paths) refer to the exact same underlying image resource.
 * Prevents accidentally deleting an active Storage object when the frontend sends back
 * a resolved public URL for an unchanged relative storage path.
 */
export function isSameImageResource(
  a?: string | null,
  b?: string | null,
  bucketName: string = "products"
): boolean {
  const normA = (a || "").trim();
  const normB = (b || "").trim();
  if (normA === normB) return true;
  const pathA = extractStoragePath(normA, bucketName);
  const pathB = extractStoragePath(normB, bucketName);
  if (pathA && pathB && pathA === pathB) return true;
  return false;
}
