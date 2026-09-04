import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const GATEWAY_AUTH_API_BASE_URL = process.env.XENI_AUTH_API_BASE_URL || "http://localhost:8080/api/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: "Missing handoff code" }, { status: 400 });
    }

    // Exchange handoff code for tokens with Xeni
    const response = await fetch(`${GATEWAY_AUTH_API_BASE_URL}/exchange-handoff`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Handoff exchange failed" }));
      console.error("Handoff exchange error:", error);
      return NextResponse.json({ error: "Handoff exchange failed" }, { status: response.status });
    }

    const data = await response.json();

    // Store tokens in HTTP-only cookies
    const cookieStore = await cookies();
    cookieStore.set("gateway_access_token", data.data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 minutes
      path: "/",
    });
    cookieStore.set("gateway_refresh_token", data.data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    // Return user data for NextAuth session establishment
    return NextResponse.json({
      user: {
        id: data.data.user_id,
        email: data.data.email,
      },
    });
  } catch (error) {
    console.error("Handoff exchange error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
