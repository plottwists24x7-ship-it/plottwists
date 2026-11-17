import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Normalizes the Supabase Project URL:
 * - Trims whitespace
 * - Strips trailing slashes
 * - Strips accidental /rest/v1 or /rest/v1/ suffix
 * - Enforces fail-closed configuration (never falls back to placeholder domains)
 */
export function normalizeSupabaseUrl(rawUrl?: string): string {
  if (!rawUrl || rawUrl.trim().length === 0) {
    throw new Error(
      "Server configuration error: NEXT_PUBLIC_SUPABASE_URL is missing or empty."
    );
  }
  let url = rawUrl.trim();
  url = url.replace(/\/+$/, "");
  url = url.replace(/\/rest\/v1\/?$/i, "");
  url = url.replace(/\/+$/, "");

  if (url.includes("placeholder-offline")) {
    throw new Error(
      "Server configuration error: Supabase URL cannot use placeholder-offline domain."
    );
  }

  return url;
}

/**
 * Creates an elevated, server-only Supabase client utilizing the private service-role key.
 *
 * Security Requirements:
 * - Marked with "server-only" to guarantee zero exposure in client bundles
 * - Disables session persistence, auto-refresh, and URL session detection
 * - Bypasses PostgreSQL RLS strictly on the server after HMAC session verification
 */
export function createAdminClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!rawUrl || rawUrl.trim().length === 0) {
    throw new Error(
      "Server configuration error: NEXT_PUBLIC_SUPABASE_URL is missing or empty."
    );
  }

  if (!serviceRoleKey || serviceRoleKey.trim().length === 0) {
    throw new Error(
      "Server configuration error: SUPABASE_SERVICE_ROLE_KEY is missing or empty. Please set it in your server environment."
    );
  }

  const url = normalizeSupabaseUrl(rawUrl);

  return createSupabaseClient(url, serviceRoleKey.trim(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

/**
 * Creates a standard server client for SSR and Server Components using publishable credentials
 * and cookie forwarding.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!rawUrl || !key) {
    throw new Error(
      "Server configuration error: Supabase credentials (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) are missing in environment variables."
    );
  }

  const url = normalizeSupabaseUrl(rawUrl);

  return createServerClient(url, key.trim(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Cookie writes can fail when called from a Server Component.
        }
      },
    },
  });
}