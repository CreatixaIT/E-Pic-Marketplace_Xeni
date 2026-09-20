"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

const GATEWAY_AUTH_API_BASE_URL = process.env.NEXT_PUBLIC_XENI_AUTH_API_BASE_URL || "http://localhost:8080/api/auth";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  const dict = useDictionary();
  
  const [formData, setFormData] = useState({
    email: emailParam || "",
    code: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = dict.auth.requiredField;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = dict.auth.invalidEmail;
    }

    // OTP validation
    if (!formData.code) {
      newErrors.code = dict.auth.requiredField;
    } else if (formData.code.length !== 6) {
      newErrors.code = "OTP must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${GATEWAY_AUTH_API_BASE_URL}/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.toLowerCase(),
          code: formData.code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "No valid OTP found. Request a new one.") {
          setErrors({ form: "Invalid or expired OTP. Please request a new one." });
        } else if (data.error === "Invalid OTP code") {
          setErrors({ code: "Invalid OTP code" });
        } else {
          setErrors({ form: data.error || dict.auth.verificationError });
        }
        return;
      }

      setSuccess(true);
      // Redirect to login after successful verification
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch {
      setErrors({ form: dict.auth.verificationError });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!formData.email) {
      setErrors({ email: dict.auth.requiredField });
      return;
    }

    if (resendCooldown > 0) {
      setErrors({ form: `Please wait ${resendCooldown} seconds before requesting another OTP` });
      return;
    }

    setIsResending(true);
    setResendSuccess(false);
    setErrors({});

    try {
      const response = await fetch(`${GATEWAY_AUTH_API_BASE_URL}/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setErrors({ form: "Too many resend attempts. Please wait before trying again." });
        } else {
          setErrors({ form: data.error || "Failed to resend OTP" });
        }
        return;
      }

      setResendSuccess(true);
      setResendCooldown(60); // 60 second cooldown
      
      // Countdown timer
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setTimeout(() => setResendSuccess(false), 5000);
    } catch {
      setErrors({ form: "Failed to resend OTP. Please check your connection." });
    } finally {
      setIsResending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // For OTP code, only allow digits
    if (name === "code") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
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
            <h1 className="text-3xl font-bold mb-2">Verify Your Email</h1>
            <p className="text-muted">
              Enter the 6-digit code sent to your email address
            </p>
          </div>

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-green-800 font-medium mb-2">
                Email verified successfully!
              </div>
              <div className="text-green-600 text-sm">
                Redirecting to login...
              </div>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              {errors.form && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
                  {errors.form}
                </div>
              )}

              {resendSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-sm">
                  New OTP sent successfully!
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
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
                <label htmlFor="code" className="block text-sm font-medium mb-2">
                  OTP Code <span className="text-red-500">*</span>
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="123456"
                  maxLength={6}
                  className={cn(
                    "w-full px-4 py-3 rounded-lg border bg-background text-center text-2xl tracking-widest",
                    "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent",
                    "transition-colors",
                    errors.code && "border-red-500"
                  )}
                />
                {errors.code && (
                  <p className="mt-1 text-sm text-red-500">{errors.code}</p>
                )}
                <p className="mt-2 text-xs text-muted">
                  Check your email for the 6-digit verification code
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Verifying..." : "Verify Email"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending || resendCooldown > 0}
                  className="text-sm text-accent hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending 
                    ? "Sending..." 
                    : resendCooldown > 0 
                      ? `Resend OTP (${resendCooldown}s)` 
                      : "Resend OTP"}
                </button>
              </div>

              <p className="text-center text-sm text-muted">
                Already verified?{" "}
                <Link
                  href="/login"
                  className="text-accent hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </Container>
    </div>
  );
}
