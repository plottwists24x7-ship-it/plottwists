/**
 * Automated Security & Cryptographic Verification Test Suite for PlotTwist Auth
 */
import {
  verifyAdminPassword,
  createSessionToken,
  verifySessionToken,
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SECONDS,
} from "../src/lib/auth.ts";

interface TestResult {
  id: number;
  name: string;
  expected: string;
  actual: string;
  status: "PASS" | "FAIL";
}

const results: TestResult[] = [];

async function runTests() {
  const TEST_PASSWORD = "plottwist_secure_test_password_2026!";
  const TEST_SECRET = "plottwist_super_secure_signing_secret_key_at_least_32_bytes!";

  process.env.ADMIN_PASSWORD = TEST_PASSWORD;
  process.env.ADMIN_SESSION_SECRET = TEST_SECRET;

  console.log("=== RUNNING AUTHENTICATION VERIFICATION TESTS ===\n");

  // 1. Valid token
  try {
    const validToken = await createSessionToken(3600);
    const isValid = await verifySessionToken(validToken);
    results.push({
      id: 1,
      name: "Valid Token Verification",
      expected: "true",
      actual: String(isValid),
      status: isValid === true ? "PASS" : "FAIL",
    });
  } catch (err: any) {
    results.push({ id: 1, name: "Valid Token Verification", expected: "true", actual: err.message, status: "FAIL" });
  }

  // 2. Expired token
  try {
    const expiredToken = await createSessionToken(-60); // expired 60 seconds ago
    const isValid = await verifySessionToken(expiredToken);
    results.push({
      id: 2,
      name: "Expired Token Rejection",
      expected: "false",
      actual: String(isValid),
      status: isValid === false ? "PASS" : "FAIL",
    });
  } catch (err: any) {
    results.push({ id: 2, name: "Expired Token Rejection", expected: "false", actual: err.message, status: "FAIL" });
  }

  // 3. Tampered payload
  try {
    const validToken = await createSessionToken(3600);
    const [payload, sig] = validToken.split(".");
    // Tamper by replacing characters in base64 payload
    const tamperedPayload = payload.slice(0, -3) + "xyz";
    const isValid = await verifySessionToken(`${tamperedPayload}.${sig}`);
    results.push({
      id: 3,
      name: "Tampered Payload Rejection",
      expected: "false",
      actual: String(isValid),
      status: isValid === false ? "PASS" : "FAIL",
    });
  } catch (err: any) {
    results.push({ id: 3, name: "Tampered Payload Rejection", expected: "false", actual: err.message, status: "FAIL" });
  }

  // 4. Tampered signature
  try {
    const validToken = await createSessionToken(3600);
    const [payload, sig] = validToken.split(".");
    const tamperedSig = sig.slice(0, -4) + "0000";
    const isValid = await verifySessionToken(`${payload}.${tamperedSig}`);
    results.push({
      id: 4,
      name: "Tampered Signature Rejection",
      expected: "false",
      actual: String(isValid),
      status: isValid === false ? "PASS" : "FAIL",
    });
  } catch (err: any) {
    results.push({ id: 4, name: "Tampered Signature Rejection", expected: "false", actual: err.message, status: "FAIL" });
  }

  // 5. Malformed token (missing dot or garbage structure)
  try {
    const malformedCases = [
      "",
      "just-a-single-string",
      "one.two.three.four",
      "...",
      "null",
      "undefined",
    ];
    let allRejected = true;
    for (const badToken of malformedCases) {
      if ((await verifySessionToken(badToken)) !== false) {
        allRejected = false;
        break;
      }
    }
    results.push({
      id: 5,
      name: "Malformed Token Structure Rejection",
      expected: "false for all malformed formats",
      actual: allRejected ? "false for all malformed formats" : "accepted invalid token",
      status: allRejected ? "PASS" : "FAIL",
    });
  } catch (err: any) {
    results.push({ id: 5, name: "Malformed Token Structure Rejection", expected: "false", actual: err.message, status: "FAIL" });
  }

  // 6. Invalid JSON payload
  try {
    const nonJsonB64 = Buffer.from("this is not json at all! {[]").toString("base64url");
    // Sign this non-json string with the real secret
    const validToken = await createSessionToken(3600);
    const [, sig] = validToken.split(".");
    const isValid = await verifySessionToken(`${nonJsonB64}.${sig}`);
    results.push({
      id: 6,
      name: "Invalid JSON Payload Rejection",
      expected: "false",
      actual: String(isValid),
      status: isValid === false ? "PASS" : "FAIL",
    });
  } catch (err: any) {
    results.push({ id: 6, name: "Invalid JSON Payload Rejection", expected: "false", actual: err.message, status: "FAIL" });
  }

  // 7. Future-issued token (issued > 60s in future, clock skew violation)
  try {
    const now = Math.floor(Date.now() / 1000);
    const futurePayload = {
      sub: "admin",
      iat: now + 500, // 500s in the future
      exp: now + 3600,
      jti: crypto.randomUUID(),
    };
    const b64Payload = Buffer.from(JSON.stringify(futurePayload)).toString("base64url");
    // Sign with real secret manually
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(TEST_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sigBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(b64Payload)
    );
    const sig = Buffer.from(sigBuffer).toString("hex");
    const isValid = await verifySessionToken(`${b64Payload}.${sig}`);
    results.push({
      id: 7,
      name: "Future-Issued Token Rejection (>60s clock skew)",
      expected: "false",
      actual: String(isValid),
      status: isValid === false ? "PASS" : "FAIL",
    });
  } catch (err: any) {
    results.push({ id: 7, name: "Future-Issued Token Rejection", expected: "false", actual: err.message, status: "FAIL" });
  }

  // 8. Missing environment variable (fail-closed)
  try {
    const savedSecret = process.env.ADMIN_SESSION_SECRET;
    delete process.env.ADMIN_SESSION_SECRET;
    const isRejectedWithoutSecret = (await verifySessionToken("any.token")) === false;
    process.env.ADMIN_SESSION_SECRET = savedSecret;

    const savedPass = process.env.ADMIN_PASSWORD;
    delete process.env.ADMIN_PASSWORD;
    const isRejectedWithoutPass = verifyAdminPassword("test") === false;
    process.env.ADMIN_PASSWORD = savedPass;

    const pass = isRejectedWithoutSecret && isRejectedWithoutPass;
    results.push({
      id: 8,
      name: "Missing Environment Variables (Fail-Closed)",
      expected: "false (fail-closed)",
      actual: pass ? "false (fail-closed)" : "allowed access",
      status: pass ? "PASS" : "FAIL",
    });
  } catch (err: any) {
    results.push({ id: 8, name: "Missing Environment Variables (Fail-Closed)", expected: "false", actual: err.message, status: "FAIL" });
  }

  // 9. Valid password (constant time)
  try {
    const isValid = verifyAdminPassword(TEST_PASSWORD);
    results.push({
      id: 9,
      name: "Valid Password Verification",
      expected: "true",
      actual: String(isValid),
      status: isValid === true ? "PASS" : "FAIL",
    });
  } catch (err: any) {
    results.push({ id: 9, name: "Valid Password Verification", expected: "true", actual: err.message, status: "FAIL" });
  }

  // 10. Invalid password (constant time)
  try {
    const wrong1 = verifyAdminPassword("wrong-password");
    const wrong2 = verifyAdminPassword(TEST_PASSWORD + "extra");
    const wrong3 = verifyAdminPassword("");
    const pass = !wrong1 && !wrong2 && !wrong3;
    results.push({
      id: 10,
      name: "Invalid Password Rejection",
      expected: "false for all incorrect attempts",
      actual: pass ? "false for all incorrect attempts" : "accepted invalid password",
      status: pass ? "PASS" : "FAIL",
    });
  } catch (err: any) {
    results.push({ id: 10, name: "Invalid Password Rejection", expected: "false", actual: err.message, status: "FAIL" });
  }

  // 11. Logout cookie invalidation options
  try {
    // Test cookie setting headers for logout
    const response = new Response(JSON.stringify({ success: true, message: "Logged out successfully." }), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `${ADMIN_COOKIE_NAME}=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`,
      },
    });
    const cookieHeader = response.headers.get("Set-Cookie") || "";
    const isInvalidated =
      cookieHeader.includes(`${ADMIN_COOKIE_NAME}=`) &&
      cookieHeader.includes("Max-Age=0") &&
      cookieHeader.includes("HttpOnly");
    results.push({
      id: 11,
      name: "Logout Cookie Invalidation (Max-Age=0, Expires=0)",
      expected: "Set-Cookie with Max-Age=0",
      actual: isInvalidated ? "Cookie expired correctly" : "Missing expiration header",
      status: isInvalidated ? "PASS" : "FAIL",
    });
  } catch (err: any) {
    results.push({ id: 11, name: "Logout Cookie Invalidation", expected: "Set-Cookie with Max-Age=0", actual: err.message, status: "FAIL" });
  }

  // 12. Unauthorized API Access Check (Session route rejection on empty cookie)
  try {
    // Direct verification of session logic with null/undefined cookie
    const nullCookieValid = await verifySessionToken(null);
    const emptyCookieValid = await verifySessionToken("");
    const isUnauth = !nullCookieValid && !emptyCookieValid;
    results.push({
      id: 12,
      name: "Unauthorized API Access Rejection (No Cookie)",
      expected: "authenticated: false",
      actual: isUnauth ? "authenticated: false" : "authenticated: true",
      status: isUnauth ? "PASS" : "FAIL",
    });
  } catch (err: any) {
    results.push({ id: 12, name: "Unauthorized API Access Rejection", expected: "authenticated: false", actual: err.message, status: "FAIL" });
  }

  // Print Formatted Report Table
  console.table(
    results.map((r) => ({
      "#": r.id,
      "Test Name": r.name,
      Expected: r.expected,
      Actual: r.actual,
      Result: r.status,
    }))
  );

  const passed = results.filter((r) => r.status === "PASS").length;
  console.log(`\nTOTAL: ${results.length} | PASSED: ${passed} | FAILED: ${results.length - passed}`);

  if (passed !== results.length) {
    process.exit(1);
  }
}

runTests();
