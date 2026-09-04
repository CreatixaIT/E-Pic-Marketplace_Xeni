import { cookies } from "next/headers"

const GATEWAY_API_BASE_URL = process.env.XENI_API_BASE_URL || "http://localhost:8080/api/public/v1"
const GATEWAY_AUTH_API_BASE_URL = process.env.XENI_AUTH_API_BASE_URL || "http://localhost:8080/api/auth"

/**
 * Gateway API client for making authenticated requests
 */
export class GatewayApiClient {
  private async getAccessToken(): Promise<string | null> {
    if (typeof window !== "undefined") {
      // Client-side: read from document.cookie
      const match = document.cookie.match(/(^|;\s*)gateway_access_token=([^;]*)/)
      return match ? match[2] : null
    } else {
      // Server-side: read from Next.js cookies
      const cookieStore = await cookies()
      return cookieStore.get("gateway_access_token")?.value || null
    }
  }

  private async getRefreshToken(): Promise<string | null> {
    if (typeof window !== "undefined") {
      const match = document.cookie.match(/(^|;\s*)gateway_refresh_token=([^;]*)/)
      return match ? match[2] : null
    } else {
      const cookieStore = await cookies()
      return cookieStore.get("gateway_refresh_token")?.value || null
    }
  }

  private async refreshAccessToken(): Promise<string | null> {
    const refreshToken = await this.getRefreshToken()
    if (!refreshToken) return null

    try {
      const response = await fetch(`${GATEWAY_AUTH_API_BASE_URL}/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })

      if (!response.ok) return null

      const data = await response.json()

      // Update tokens in cookies
      if (typeof window !== "undefined") {
        document.cookie = `gateway_access_token=${data.data.access_token}; path=/; max-age=900; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`
        document.cookie = `gateway_refresh_token=${data.data.refresh_token}; path=/; max-age=604800; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`
      } else {
        const cookieStore = await cookies()
        cookieStore.set("gateway_access_token", data.data.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 15 * 60,
          path: "/",
        })
        cookieStore.set("gateway_refresh_token", data.data.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60,
          path: "/",
        })
      }

      return data.data.access_token
    } catch (error) {
      console.error("Token refresh error:", error)
      return null
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    let token = await this.getAccessToken()

    // Try with current token
    let response = await fetch(`${GATEWAY_API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })

    // If unauthorized, try to refresh token
    if (response.status === 401) {
      token = await this.refreshAccessToken()
      if (token) {
        response = await fetch(`${GATEWAY_API_BASE_URL}${endpoint}`, {
          ...options,
          headers: {
            ...options.headers,
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Request failed" }))
      throw new Error(error.message || "Request failed")
    }

    return response.json()
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "GET",
    })
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    })
  }
}

// Singleton instance
export const gatewayApi = new GatewayApiClient()
