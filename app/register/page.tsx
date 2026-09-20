"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { validatePassword, checkPasswordRequirements } from "@/lib/validation";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const dict = useDictionary();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if already logged in
  if (session) {
    router.push("/");
    return null;
  }

  const passwordRequirements = checkPasswordRequirements(formData.password);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Full name validation
    if (!formData.full_name.trim()) {
      newErrors.full_name = dict.auth.requiredField;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = dict.auth.requiredField;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = dict.auth.invalidEmail;
    }

    // Password validation
    const passwordValidation = validatePassword(formData.password);
    if (!formData.password) {
      newErrors.password = dict.auth.requiredField;
    } else if (!passwordValidation.isValid) {
      newErrors.password = dict.auth.passwordRequirements;
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
          full_name: formData.full_name,
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
        } else if (data.error.includes("Password")) {
          setErrors({ password: data.error });
        } else {
          setErrors({ form: data.error || dict.auth.registerError });
        }
        return;
      }

      setSuccess(true);
      // Redirect to verification page after successful registration
      setTimeout(() => {
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
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

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
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
                Redirecting to verification...
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
                <label htmlFor="full_name" className="block text-sm font-medium mb-2">
                  {dict.auth.name} <span className="text-red-500">*</span>
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder={dict.auth.namePlaceholder}
                  className={cn(
                    "w-full px-4 py-3 rounded-lg border bg-background",
                    "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent",
                    "transition-colors",
                    errors.full_name && "border-red-500"
                  )}
                />
                {errors.full_name && (
                  <p className="mt-1 text-sm text-red-500">{errors.full_name}</p>
                )}
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
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={dict.auth.passwordPlaceholder}
                    className={cn(
                      "w-full px-4 py-3 rounded-lg border bg-background pr-12",
                      "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent",
                      "transition-colors",
                      errors.password && "border-red-500"
                    )}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? dict.auth.hidePassword : dict.auth.showPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-muted mb-1">{dict.auth.passwordRequirements}</p>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div className={cn("flex items-center gap-1", passwordRequirements.length ? "text-green-600" : "text-muted")}>
                      {passwordRequirements.length ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      {dict.auth.passwordLength}
                    </div>
                    <div className={cn("flex items-center gap-1", passwordRequirements.uppercase ? "text-green-600" : "text-muted")}>
                      {passwordRequirements.uppercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      {dict.auth.passwordUppercase}
                    </div>
                    <div className={cn("flex items-center gap-1", passwordRequirements.lowercase ? "text-green-600" : "text-muted")}>
                      {passwordRequirements.lowercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      {dict.auth.passwordLowercase}
                    </div>
                    <div className={cn("flex items-center gap-1", passwordRequirements.number ? "text-green-600" : "text-muted")}>
                      {passwordRequirements.number ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      {dict.auth.passwordNumber}
                    </div>
                    <div className={cn("flex items-center gap-1", passwordRequirements.special ? "text-green-600" : "text-muted")}>
                      {passwordRequirements.special ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      {dict.auth.passwordSpecial}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                  {dict.auth.confirmPassword} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={dict.auth.confirmPasswordPlaceholder}
                    className={cn(
                      "w-full px-4 py-3 rounded-lg border bg-background pr-12",
                      "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent",
                      "transition-colors",
                      errors.confirmPassword && "border-red-500",
                      formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && "border-green-500"
                    )}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    aria-label={showConfirmPassword ? dict.auth.hidePassword : dict.auth.showPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && (
                  <p className="mt-1 text-sm text-green-600">{dict.auth.passwordMatch}</p>
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
