"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Redirect if already logged in
  if (session) {
    router.push("/");
    return null;
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "requiredField";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "invalidEmail";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "requiredField";
    } else if (formData.password.length < 8) {
      newErrors.password = "weakPassword";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "requiredField";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "passwordMismatch";
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
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name || undefined,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Map API errors to form errors
        if (data.error === "Email already registered") {
          setErrors({ email: "emailExists" });
        } else if (data.error === "Invalid email format") {
          setErrors({ email: "invalidEmail" });
        } else if (data.error === "Password must be at least 8 characters long") {
          setErrors({ password: "weakPassword" });
        } else {
          setErrors({ form: data.error || "registerError" });
        }
        return;
      }

      setSuccess(true);
      // Redirect to login after successful registration
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch {
      setErrors({ form: "registerError" });
    } finally {
      setIsLoading(false);
    }
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
            <h1 className="text-3xl font-bold mb-2">Register</h1>
            <p className="text-muted">Create an account to get started</p>
          </div>

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-green-800 font-medium mb-2">
                Account created successfully!
              </div>
              <div className="text-green-600 text-sm">
                Redirecting to login...
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.form && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
                  {errors.form}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name <span className="text-muted">(optional)</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className={cn(
                    "w-full px-4 py-3 rounded-lg border bg-background",
                    "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent",
                    "transition-colors"
                  )}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
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
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
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
                <p className="mt-1 text-xs text-muted">
                  Must be at least 8 characters
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={cn(
                    "w-full px-4 py-3 rounded-lg border bg-background",
                    "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent",
                    "transition-colors",
                    errors.confirmPassword && "border-red-500"
                  )}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>

              <p className="text-center text-sm text-muted">
                Already have an account?{" "}
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
