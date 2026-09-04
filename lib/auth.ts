import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { cookies } from "next/headers"

const GATEWAY_AUTH_URL = process.env.XENI_AUTH_API_BASE_URL || "http://localhost:8080/api/auth"

// Map Gateway roles to frontend roles
function mapGatewayRoleToFrontendRole(gatewayRole: string): string {
  const roleMap: Record<string, string> = {
    "user": "BUYER",
    "seller": "SELLER",
    "admin": "ADMIN",
    "super_admin": "ADMIN",
  }
  return roleMap[gatewayRole] || "BUYER"
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Call Gateway login API
          const response = await fetch(`${GATEWAY_AUTH_URL}/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          if (!response.ok) {
            const error = await response.json()
            console.error("Gateway login error:", error)
            return null
          }

          const data = await response.json()

          // Store tokens in HTTP-only cookies for API calls
          const cookieStore = await cookies()
          cookieStore.set("gateway_access_token", data.data.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60, // 15 minutes
            path: "/",
          })
          cookieStore.set("gateway_refresh_token", data.data.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: "/",
          })

          // Return user data for NextAuth session
          return {
            id: data.data.user.id,
            email: data.data.user.email,
            name: data.data.user.full_name,
            role: data.data.user.role,
          }
        } catch (error) {
          console.error("Gateway login error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      if (token.name && session.user) {
        session.user.name = token.name as string
      }
      if (token.email && session.user) {
        session.user.email = token.email as string
      }
      if (token.role && session.user) {
        // Map Gateway roles to frontend roles
        const gatewayRole = token.role as string
        session.user.role = mapGatewayRoleToFrontendRole(gatewayRole)
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token.name = user.name
        token.email = user.email
        token.role = user.role
      }
      return token
    },
  },
})
