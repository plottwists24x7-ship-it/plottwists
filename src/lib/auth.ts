export const ADMIN_COOKIE_NAME = "admin_session";

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "plottwist24x_default_admin_secret_2026";
const EXPECTED_PASSWORD = process.env.ADMIN_PASSWORD || "chaniya6769";

// Helper to convert string to Uint8Array
function stringToUint8(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Helper to convert ArrayBuffer to Hex String
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Generate HMAC SHA-256 Signature
export async function createSessionToken(): Promise<string> {
  const payload = "plottwist24x_admin_authenticated";
  const key = await crypto.subtle.importKey(
    "raw",
    stringToUint8(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    stringToUint8(payload)
  );

  const signature = bufferToHex(signatureBuffer);
  return `${payload}.${signature}`;
}

// Verify HMAC SHA-256 Signature
export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payload, signature] = parts;
  if (payload !== "plottwist24x_admin_authenticated") return false;

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      stringToUint8(SESSION_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      stringToUint8(payload)
    );

    const expectedSignature = bufferToHex(signatureBuffer);
    return signature === expectedSignature;
  } catch (err) {
    console.error("Session verification error:", err);
    return false;
  }
}

// Verify submitted password against environment variable
export function verifyAdminPassword(submitted: string): boolean {
  if (!submitted) return false;
  const target = process.env.ADMIN_PASSWORD || EXPECTED_PASSWORD;
  return submitted.trim() === target.trim();
}
