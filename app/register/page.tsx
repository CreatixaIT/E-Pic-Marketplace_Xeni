"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const dict = useDictionary();
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
      newErrors.email = dict.auth.requiredField;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = dict.auth.invalidEmail;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = dict.auth.requiredField;
    } else if (formData.password.length < 8) {
      newErrors.password = dict.auth.weakPassword;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = dict.auth.requiredField;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = dict.auth.passwordMismatch;
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
          setErrors({ email: dict.auth.emailExists });
        } else if (data.error === "Invalid email format") {
          setErrors({ email: dict.auth.invalidEmail });
        } else if (data.error === "Password must be at least 8 characters long") {
          setErrors({ password: dict.auth.weakPassword });
        } else {
          setErrors({ form: data.error || dict.auth.registerError });
        }
        return;
      }

      setSuccess(true);
      // Redirect to login after successful registration
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch {
      setErrors({ form: dict.auth.registerError });
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
            <h1 className="text-3xl font-bold mb-2">{dict.auth.registerTitle}</h1>
            <p className="text-muted">{dict.auth.registerDescription}</p>
          </div>

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-green-800 font-medium mb-2">
                {dict.auth.registerSuccess}
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
                  {dict.auth.name} <span className="text-muted">(optional)</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={dict.auth.namePlaceholder}
                  className={cn(
                    "w-full px-4 py-3 rounded-lg border bg-background",
                    "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent",
                    "transition-colors"
                  )}
                />
              </div>

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
                <p className="mt-1 text-xs text-muted">
                  {dict.auth.weakPassword}
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                  {dict.auth.confirmPassword} <span className="text-red-500">*</span>
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={dict.auth.confirmPasswordPlaceholder}
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
                {isLoading ? dict.auth.registering : dict.auth.signUp}
              </Button>

              <p className="text-center text-sm text-muted">
                {dict.auth.hasAccount}{" "}
                <Link
                  href="/login"
                  className="text-accent hover:underline font-medium"
                >
                  {dict.auth.signIn}
                </Link>
              </p>
            </form>
          )}
        </div>
      </Container>
    </div>
  );
}
