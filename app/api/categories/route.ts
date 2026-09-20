import { NextResponse } from "next/server";

const XENI_PUBLIC_API_BASE_URL = process.env.XENI_PUBLIC_API_BASE_URL || "http://localhost:8080/api/public/v1";

export async function GET() {
  try {
    const response = await fetch(`${XENI_PUBLIC_API_BASE_URL}/categories`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Xeni API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch categories from Xeni:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
