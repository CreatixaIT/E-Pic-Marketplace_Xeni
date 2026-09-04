import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const GATEWAY_API_BASE_URL = process.env.XENI_API_BASE_URL || "http://localhost:8080/api";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("gateway_access_token")?.value;
    const sessionID = request.nextUrl.searchParams.get("session_id");

    if (!accessToken && !sessionID) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Build URL with session_id if present (for guest carts)
    let url = `${GATEWAY_API_BASE_URL}/buyer/cart/items/${id}`;
    if (sessionID) {
      url += `?session_id=${sessionID}`;
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Failed to update cart item" }));
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Cart item update error:", error);
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("gateway_access_token")?.value;
    const sessionID = request.nextUrl.searchParams.get("session_id");

    if (!accessToken && !sessionID) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Build URL with session_id if present (for guest carts)
    let url = `${GATEWAY_API_BASE_URL}/buyer/cart/items/${id}`;
    if (sessionID) {
      url += `?session_id=${sessionID}`;
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Failed to remove cart item" }));
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Cart item remove error:", error);
    return NextResponse.json({ error: "Failed to remove cart item" }, { status: 500 });
  }
}
