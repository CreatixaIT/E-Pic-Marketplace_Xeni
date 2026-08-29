"use client";

import { useState } from "react";
import { useCheckout } from "@/lib/checkout";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n/types";
import type { CustomerDetails } from "@/lib/checkout/types";

export function CustomerDetailsForm({ dictionary }: { dictionary: Dictionary }) {
  const { setCustomerDetails, advanceToNextStep } = useCheckout();
  const { getSavedCustomerPreferences, saveCustomerPreferences } = useCart();
  const savedPrefs = getSavedCustomerPreferences();
  
  const [formData, setFormData] = useState<CustomerDetails>({
    fullName: savedPrefs?.fullName || "",
    phone: savedPrefs?.phone || "",
    email: savedPrefs?.email || "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerDetails, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerDetails, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setCustomerDetails(formData);
      // Save non-sensitive preferences for express checkout
      saveCustomerPreferences({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      });
      advanceToNextStep();
    }
  };

  const handleChange = (field: keyof CustomerDetails, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 md:p-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold">{dictionary.checkout.customerDetails.title}</h2>
        <p className="mt-2 text-sm text-muted">
          {dictionary.checkout.customerDetails.description}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-2">
            {dictionary.checkout.customerDetails.fullName}
          </label>
          <input
            type="text"
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder={dictionary.checkout.customerDetails.fullNamePlaceholder}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 disabled:opacity-50"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
          />
          {errors.fullName && (
            <p id="fullName-error" className="mt-1.5 text-sm text-red-500" role="alert">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            {dictionary.checkout.customerDetails.phone}
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder={dictionary.checkout.customerDetails.phonePlaceholder}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 disabled:opacity-50"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          {errors.phone && (
            <p id="phone-error" className="mt-1.5 text-sm text-red-500" role="alert">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            {dictionary.checkout.customerDetails.email}
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder={dictionary.checkout.customerDetails.emailPlaceholder}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 disabled:opacity-50"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : "email-explanation"}
          />
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-sm text-red-500" role="alert">
              {errors.email}
            </p>
          )}
          <p id="email-explanation" className="mt-1.5 text-xs text-muted">
            {dictionary.checkout.customerDetails.emailExplanation}
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button type="submit" className="w-full" size="lg">
            {dictionary.checkout.customerDetails.continue}
          </Button>
        </div>
      </form>
    </div>
  );
}
