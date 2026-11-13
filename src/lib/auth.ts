export const ADMIN_COOKIE_NAME = "admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface AdminSessionPayload {
  sub: "admin";
  iat: number;
  exp: number;
  jti: string;
}

/**
 * Retrieves the server-side session signing secret.
 * Fails closed if the environment variable is not defined.
 */
function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.trim().length === 0) {
    throw new Error(
      "Server authentication configuration error: ADMIN_SESSION_SECRET environment variable is missing or empty."
    );
  }
  return secret.trim();
}

/**
 * Retrieves the server-side admin password.
 * Fails closed if the environment variable is not defined.
 */
function getExpectedPassword(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.trim().length === 0) {
    throw new Error(
      "Server authentication configuration error: ADMIN_PASSWORD environment variable is missing or empty."
    );
  }
  return password.trim();
}

/**
 * Constant-time string comparison to defend against timing attacks.
 */
function constantTimeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const aBytes = enc.encode(a);
  const bBytes = enc.encode(b);

  let diff = aBytes.length ^ bBytes.length;
  const maxLen = Math.max(aBytes.length, bBytes.length);

  for (let i = 0; i < maxLen; i++) {
    const aByte = i < aBytes.length ? aBytes[i] : 0;
    const bByte = i < bBytes.length ? bBytes[i] : 0;
    diff |= aByte ^ bByte;
  }

  return diff === 0;
}

/**
 * Convert string to BufferSource for Web Crypto API
 */
function stringToBufferSource(str: string): BufferSource {
  const encoded = new TextEncoder().encode(str);
  return encoded as unknown as BufferSource;
}

/**
 * Convert ArrayBuffer to Hex String
 */
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * URL-safe Base64 encoding
 */
function base64UrlEncode(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "utf-8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * URL-safe Base64 decoding
 */
function base64UrlDecode(b64url: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(b64url, "base64url").toString("utf-8");
  }
  let b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) {
    b64 += "=";
  }
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Generates an HMAC SHA-256 signature for a message using the server secret
 */
async function signMessage(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    stringToBufferSource(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    stringToBufferSource(message)
  );

  return bufferToHex(signatureBuffer);
}

/**
 * Generates a signed, expiring session token.
 * Payload includes sub ("admin"), iat (issued at), exp (expires at), and a unique jti nonce.
 */
export async function createSessionToken(
  durationSeconds: number = ADMIN_SESSION_MAX_AGE_SECONDS
): Promise<string> {
  const secret = getSessionSecret();
  const now = Math.floor(Date.now() / 1000);
  const exp = now + durationSeconds;
  const jti = crypto.randomUUID();

  const payload: AdminSessionPayload = {
    sub: "admin",
    iat: now,
    exp,
    jti,
  };

  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = await signMessage(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies a session token:
 * 1. Validates format (payload.signature)
 * 2. Validates HMAC SHA-256 signature using constant-time comparison
 * 3. Enforces server-side expiration timestamp
 * 4. Fails closed on any corruption, expiration, or secret mismatch
 */
export async function verifySessionToken(
  token: string | undefined | null
): Promise<boolean> {
  if (!token || typeof token !== "string") {
    return false;
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return false;
  }

  const [encodedPayload, signature] = parts;
  if (!encodedPayload || !signature) {
    return false;
  }

  try {
    const secret = getSessionSecret();

    // 1. Verify cryptographic signature
    const expectedSignature = await signMessage(encodedPayload, secret);
    if (!constantTimeEqual(signature, expectedSignature)) {
      return false;
    }

    // 2. Decode and parse payload
    const decodedJson = base64UrlDecode(encodedPayload);
    const payload = JSON.parse(decodedJson) as AdminSessionPayload;

    if (payload.sub !== "admin") {
      return false;
    }

    const now = Math.floor(Date.now() / 1000);

    // 3. Enforce expiration
    if (typeof payload.exp !== "number" || now > payload.exp) {
      return false;
    }

    // 4. Enforce reasonable issued-at (allow 60s clock skew)
    if (typeof payload.iat !== "number" || payload.iat > now + 60) {
      return false;
    }

    return true;
  } catch {
    // Fail closed on any JSON parse, base64, or crypto error
    return false;
  }
}

/**
 * Verifies submitted password against the server environment variable.
 * Uses constant-time comparison to protect against side-channel timing attacks.
 * Fails closed if ADMIN_PASSWORD is not configured.
 */
export function verifyAdminPassword(submitted: string): boolean {
  if (!submitted || typeof submitted !== "string") {
    return false;
  }

  try {
    const expected = getExpectedPassword();
    return constantTimeEqual(submitted.trim(), expected);
  } catch (err) {
    console.error(
      "[Auth Error] verifyAdminPassword failed:",
      err instanceof Error ? err.message : err
    );
    return false;
  }
}
