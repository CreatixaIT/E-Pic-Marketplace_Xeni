"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract code from hash fragment
        const hash = window.location.hash;
        const codeMatch = hash.match(/[?&]code=([^&]+)/);

        if (!codeMatch) {
          setError("Missing authorization code");
          return;
        }

        const code = codeMatch[1];

        // Exchange handoff code for tokens
        const response = await fetch("/api/auth/exchange-handoff", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Exchange failed" }));
          setError(errorData.error || "Failed to exchange authorization code");
          return;
        }

        const data = await response.json();

        // Establish NextAuth session with credentials
        // We use a special marker to indicate this is an OAuth handoff
        const result = await signIn("credentials", {
          email: data.user.email,
          password: "oauth-handoff",
          redirect: false,
        });

        if (result?.error) {
          setError("Failed to establish session");
          return;
        }

        // Redirect to account page with clean URL
        router.replace("/account");
      } catch (err) {
        console.error("Auth callback error:", err);
        setError("An error occurred during authentication");
      }
    };

    handleCallback();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}
