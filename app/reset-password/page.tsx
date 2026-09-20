"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

const GATEWAY_AUTH_API_BASE_URL = process.env.NEXT_PUBLIC_XENI_AUTH_API_BASE_URL || "http://localhost:8080/api/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  const dict = useDictionary();
  
  const [formData, setFormData] = useState({
    email: emailParam || "",
    code: "",
    newPassword: "",
    confirmPassword: "",
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

    // Code validation
    if (!formData.code) {
      newErrors.code = dict.auth.requiredField;
    } else if (formData.code.length !== 6) {
      newErrors.code = "Reset code must be 6 digits";
    }

    // Password validation
    if (!formData.newPassword) {
      newErrors.newPassword = dict.auth.requiredField;
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = dict.auth.weakPassword || "Password must be at least 8 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = dict.auth.requiredField;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = dict.auth.passwordMismatch || "Passwords do not match";
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
      const response = await fetch(`${GATEWAY_AUTH_API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.toLowerCase(),
          code: formData.code,
          new_password: formData.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to reset password");
      }

      setSuccess(true);
    } catch (error) {
      console.error("Password reset error:", error);
      setErrors({ 
        form: error instanceof Error ? error.message : "Failed to reset password" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!formData.email) {
      setErrors({ email: dict.auth.requiredField });
      return;
    }

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
        throw new Error("Failed to resend reset code");
      }

      alert(dict.auth.resetCodeResent || "Reset code resent successfully");
    } catch (error) {
      console.error("Resend code error:", error);
      setErrors({ 
        email: error instanceof Error ? error.message : "Failed to resend reset code" 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 py-12 px-4">
      <Container>
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                {dict.auth.resetPassword || "Reset Password"}
              </h1>
              <p className="text-neutral-600">
                {dict.auth.resetPasswordDescription || "Enter the code from your email and your new password"}
              </p>
            </div>

            {success ? (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">
                    {dict.auth.passwordResetSuccess || "Password reset successfully"}
                  </p>
                </div>
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full"
                >
                  {dict.auth.signIn || "Sign In"}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.form && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">{errors.form}</p>
                  </div>
                )}

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

                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-neutral-700 mb-2">
                    {dict.auth.resetCode || "Reset Code"}
                  </label>
                  <input
                    id="code"
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    maxLength={6}
                    className={cn(
                      "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                      errors.code ? "border-red-500" : "border-neutral-300"
                    )}
                    placeholder="123456"
                  />
                  {errors.code && (
                    <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                  )}
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    {dict.auth.resendCode || "Resend Code"}
                  </button>
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                    {dict.auth.newPassword || "New Password"}
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className={cn(
                      "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                      errors.newPassword ? "border-red-500" : "border-neutral-300"
                    )}
                    placeholder={dict.auth.passwordPlaceholder}
                  />
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                    {dict.auth.confirmPassword}
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={cn(
                      "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                      errors.confirmPassword ? "border-red-500" : "border-neutral-300"
                    )}
                    placeholder={dict.auth.confirmPasswordPlaceholder}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? dict.auth.resetting || "Resetting..." : dict.auth.resetPassword || "Reset Password"}
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