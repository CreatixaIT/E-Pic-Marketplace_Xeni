import { NextResponse } from "next/server"
import { signOut } from "@/lib/auth"
import { cookies } from "next/headers"

const GATEWAY_AUTH_API_BASE_URL = process.env.XENI_AUTH_API_BASE_URL || "http://localhost:8080/api/auth"

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("gateway_access_token")?.value

    // Call Gateway logout endpoint if we have a token
    if (accessToken) {
      try {
        await fetch(`${GATEWAY_AUTH_API_BASE_URL}/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        })
      } catch (error) {
        console.error("Gateway logout error:", error)
        // Continue with local logout even if Gateway logout fails
      }
    }

    // Clear Gateway tokens
    cookieStore.delete("gateway_access_token")
    cookieStore.delete("gateway_refresh_token")

    // Clear NextAuth session
    await signOut({ redirect: false })

    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    )
  }
}
