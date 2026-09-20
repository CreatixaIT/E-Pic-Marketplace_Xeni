"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

const GATEWAY_AUTH_API_BASE_URL = process.env.NEXT_PUBLIC_XENI_AUTH_API_BASE_URL || "http://localhost:8080/api/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const dict = useDictionary();
  
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = dict.auth.requiredField;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = dict.auth.invalidEmail;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${GATEWAY_AUTH_API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.toLowerCase(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send reset email");
      }

      setSuccess(true);
    } catch (error) {
      console.error("Password reset error:", error);
      setErrors({ 
        email: error instanceof Error ? error.message : "Failed to send reset email" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 py-12 px-4">
      <Container>
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                {dict.auth.forgotPassword || "Forgot Password"}
              </h1>
              <p className="text-neutral-600">
                {dict.auth.forgotPasswordDescription || "Enter your email to receive a password reset code"}
              </p>
            </div>

            {success ? (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">
                    {dict.auth.resetEmailSent || "Password reset code sent to your email"}
                  </p>
                </div>
                <Button
                  onClick={() => router.push("/reset-password?email=" + encodeURIComponent(formData.email))}
                  className="w-full"
                >
                  {dict.auth.resetPassword || "Reset Password"}
                </Button>
                <div className="text-center">
                  <Link
                    href="/login"
                    className="text-sm text-neutral-600 hover:text-neutral-900"
                  >
                    {dict.auth.backToLogin || "Back to login"}
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                    {dict.auth.email}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={cn(
                      "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                      errors.email ? "border-red-500" : "border-neutral-300"
                    )}
                    placeholder={dict.auth.emailPlaceholder}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? dict.auth.sending || "Sending..." : dict.auth.sendResetCode || "Send Reset Code"}
                </Button>

                <div className="text-center">
                  <Link
                    href="/login"
                    className="text-sm text-neutral-600 hover:text-neutral-900"
                  >
                    {dict.auth.backToLogin || "Back to login"}
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}