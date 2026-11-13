import fs from "fs";
import path from "path";

// Auto-load .env.local
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const k = match[1].trim();
      const v = match[2].trim().replace(/^['"](.*)['"]$/, "$1");
      if (!process.env[k]) {
        process.env[k] = v;
      }
    }
  }
}

async function run() {
  console.log("=== VERIFYING ADMIN AUTH & PROTECTED ROUTE LIFECYCLE ===");

  const BASE_URL = "http://localhost:3005";
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    console.error("ADMIN_PASSWORD not found in environment.");
    process.exit(1);
  }

  // 1. Invalid Login Attempt
  console.log("\n[Test 1] Invalid Password Attempt");
  const badLogin = await fetch(`${BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: "incorrect-password" }),
  });
  console.log("Status:", badLogin.status);
  const badData = await badLogin.json();
  console.log("Response:", badData);
  if (badLogin.status === 401 && badData.success === false) {
    console.log("-> PASS: Invalid login returned 401.");
  } else {
    console.error("-> FAIL: Invalid login was not rejected.");
  }

  // 2. Valid Login Attempt
  console.log("\n[Test 2] Valid Password Attempt");
  const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  console.log("Status:", loginRes.status);
  const setCookie = loginRes.headers.get("set-cookie");
  console.log("Set-Cookie:", setCookie);
  const loginData = await loginRes.json();
  console.log("Response:", loginData);

  if (
    loginRes.status === 200 &&
    loginData.success === true &&
    setCookie &&
    setCookie.includes("admin_session") &&
    setCookie.includes("HttpOnly") &&
    setCookie.includes("Max-Age=604800")
  ) {
    console.log("-> PASS: Valid login succeeded and issued secure HTTP-only cookie.");
  } else {
    console.error("-> FAIL: Valid login failed or missing cookie attributes.");
  }

  // Extract session cookie string
  const cookieMatch = setCookie?.match(/admin_session=([^;]+)/);
  const cookieValue = cookieMatch ? cookieMatch[0] : "";

  // 3. Verify Active Session API (/api/admin/session)
  console.log("\n[Test 3] Session Check API with Valid Cookie");
  const sessionRes = await fetch(`${BASE_URL}/api/admin/session`, {
    headers: { Cookie: cookieValue },
  });
  console.log("Status:", sessionRes.status);
  const sessionData = await sessionRes.json();
  console.log("Session Data:", sessionData);
  if (sessionRes.status === 200 && sessionData.authenticated === true) {
    console.log("-> PASS: Active session recognized.");
  } else {
    console.error("-> FAIL: Active session was not recognized.");
  }

  // 4. Session Check API without Cookie (Should return authenticated: false)
  console.log("\n[Test 4] Session Check API without Cookie");
  const noSessionRes = await fetch(`${BASE_URL}/api/admin/session`);
  const noSessionData = await noSessionRes.json();
  console.log("Status:", noSessionRes.status, "Data:", noSessionData);
  if (noSessionData.authenticated === false) {
    console.log("-> PASS: Unauthenticated session check returns authenticated: false.");
  } else {
    console.error("-> FAIL: Unauthenticated check failed.");
  }

  // 5. Admin Logout (/api/admin/logout)
  console.log("\n[Test 5] Admin Logout");
  const logoutRes = await fetch(`${BASE_URL}/api/admin/logout`, {
    method: "POST",
    headers: { Cookie: cookieValue },
  });
  console.log("Status:", logoutRes.status);
  const logoutCookie = logoutRes.headers.get("set-cookie");
  console.log("Logout Set-Cookie:", logoutCookie);
  if (
    logoutRes.status === 200 &&
    logoutCookie &&
    (logoutCookie.includes("Max-Age=0") || logoutCookie.includes("expires=Thu, 01 Jan 1970"))
  ) {
    console.log("-> PASS: Logout successfully cleared session cookie with Max-Age=0.");
  } else {
    console.error("-> FAIL: Logout cookie invalidation failed.");
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
