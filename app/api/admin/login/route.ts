import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminPassword,
  createSessionToken,
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // 1. Verify required server environment variables are configured
    if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
      console.error(
        "[Auth Error] Missing required server environment variable: ADMIN_PASSWORD and/or ADMIN_SESSION_SECRET."
      );
      return NextResponse.json(
        {
          success: false,
          message:
            "Server authentication is not configured. Please set ADMIN_PASSWORD and ADMIN_SESSION_SECRET.",
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { password } = body;

    // 2. Validate password in constant time
    if (!password || !verifyAdminPassword(password)) {
      return NextResponse.json(
        { success: false, message: "Incorrect password. Please try again." },
        { status: 401 }
      );
    }

    // 3. Issue cryptographically signed, expiring session token
    const token = await createSessionToken();
    const response = NextResponse.json({
      success: true,
      message: "Authentication successful.",
    });

    // 4. Set secure HttpOnly session cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch (err) {
    console.error("Login API error:", err);
    return NextResponse.json(
      { success: false, message: "Server error occurred during login." },
      { status: 500 }
    );
  }
}
