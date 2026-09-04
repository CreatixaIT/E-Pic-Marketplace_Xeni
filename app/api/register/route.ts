import { NextResponse } from "next/server"

const GATEWAY_AUTH_API_BASE_URL = process.env.XENI_AUTH_API_BASE_URL || "http://localhost:8080/api/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, full_name, language } = body

    // Validate input
    if (!email || !password || !full_name) {
      return NextResponse.json(
        { error: "Email, password, and full name are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Validate password strength (minimum 8 characters)
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      )
    }

    // Call Gateway registration API
    const response = await fetch(`${GATEWAY_AUTH_API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.toLowerCase(),
        password,
        full_name,
        language: language || "en",
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: error.message || "Registration failed" },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json(
      {
        message: "Registration successful. Please verify your email.",
        user: {
          id: data.data.user_id,
          email: data.data.email,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    )
  }
}
