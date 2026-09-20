"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

const GATEWAY_AUTH_API_BASE_URL = process.env.NEXT_PUBLIC_XENI_AUTH_API_BASE_URL || "http://localhost:8080/api/auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const dict = useDictionary();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [verificationRequired, setVerificationRequired] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = dict.auth.requiredField;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = dict.auth.invalidEmail;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = dict.auth.requiredField;
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
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        // Check if error is related to email verification
        if (result.error.includes("verify your email") || result.error.includes("Please verify")) {
          setVerificationRequired(true);
          setErrors({ form: "Please verify your email before logging in." });
        } else {
          setErrors({ form: dict.auth.loginError });
        }
        return;
      }

      // Redirect to callback URL or home on successful login
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setErrors({ form: dict.auth.loginError });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to Xeni Google OAuth
    router.push(`${GATEWAY_AUTH_API_BASE_URL}/google/login`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Container>
        <div className="mx-auto max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{dict.auth.loginTitle}</h1>
            <p className="text-muted">{dict.auth.loginDescription}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.form && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
                {errors.form}
                {verificationRequired && (
                  <div className="mt-2">
                    <Link
                      href={`/verify-email?email=${encodeURIComponent(formData.email)}`}
                      className="text-accent hover:underline font-medium"
                    >
                      Go to email verification
                    </Link>
                  </div>
                )}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                {dict.auth.email} <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={dict.auth.emailPlaceholder}
                className={cn(
                  "w-full px-4 py-3 rounded-lg border bg-background",
                  "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent",
                  "transition-colors",
                  errors.email && "border-red-500"
                )}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                {dict.auth.password} <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={dict.auth.passwordPlaceholder}
                className={cn(
                  "w-full px-4 py-3 rounded-lg border bg-background",
                  "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent",
                  "transition-colors",
                  errors.password && "border-red-500"
                )}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? dict.auth.signingIn : dict.auth.signIn}
            </Button>

            <div className="text-center">
              <Link
                href="/forgot-password"
                className="text-sm text-accent hover:underline"
              >
                {dict.auth.forgotPassword || "Forgot Password?"}
              </Link>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={handleGoogleLogin}
              className="w-full"
            >
              Continue with Google
            </Button>

            <p className="text-center text-sm text-muted">
              {dict.auth.noAccount}{" "}
              <Link
                href="/register"
                className="text-accent hover:underline font-medium"
              >
                {dict.auth.signUp}
              </Link>
            </p>
          </form>
        </div>
      </Container>
    </div>
  );
}
