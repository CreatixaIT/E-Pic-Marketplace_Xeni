"use client";

import { useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { useCheckout } from "@/lib/checkout";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n/types";
import type { DeliveryAddress } from "@/lib/checkout/types";

export function DeliveryAddressForm({ dictionary }: { dictionary: Dictionary }) {
  const { customerDetails, setDeliveryAddress, advanceToNextStep, setStep } = useCheckout();
  const [formData, setFormData] = useState<DeliveryAddress>({
    recipientName: customerDetails?.fullName || "",
    phone: customerDetails?.phone || "",
    country: "",
    city: "",
    addressLine: "",
    apartmentDetails: "",
    deliveryInstructions: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof DeliveryAddress, string>>>({});
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof DeliveryAddress, string>> = {};

    if (!formData.recipientName.trim()) {
      newErrors.recipientName = "Recipient name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.addressLine.trim()) {
      newErrors.addressLine = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGetLocation = () => {
    setLocationError(null);
    setIsGettingLocation(true);

    if (!navigator.geolocation) {
      setLocationError(dictionary.checkout.deliveryAddress.locationUnavailable);
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Successfully got coordinates
        const { latitude, longitude } = position.coords;
        
        setFormData((prev) => ({
          ...prev,
          coordinates: { latitude, longitude },
        }));
        
        setIsGettingLocation(false);
        
        // Note: We're not pretending to convert coordinates to an address
        // In production, this would call a real geocoding service
        // For now, we just show that we have the coordinates
      },
      (error) => {
        // Handle location errors
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(dictionary.checkout.deliveryAddress.locationDenied);
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError(dictionary.checkout.deliveryAddress.locationUnavailable);
            break;
          case error.TIMEOUT:
            setLocationError(dictionary.checkout.deliveryAddress.locationUnavailable);
            break;
          default:
            setLocationError(dictionary.checkout.deliveryAddress.locationUnavailable);
        }
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setDeliveryAddress(formData);
      advanceToNextStep();
    }
  };

  const handleChange = (field: keyof DeliveryAddress, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBack = () => {
    setStep("customer-details");
  };

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 md:p-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold">{dictionary.checkout.deliveryAddress.title}</h2>
        <p className="mt-2 text-sm text-muted">
          {dictionary.checkout.deliveryAddress.description}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Recipient Name */}
        <div>
          <label htmlFor="recipientName" className="block text-sm font-medium mb-2">
            {dictionary.checkout.deliveryAddress.recipientName}
          </label>
          <input
            type="text"
            id="recipientName"
            value={formData.recipientName}
            onChange={(e) => handleChange("recipientName", e.target.value)}
            placeholder={dictionary.checkout.deliveryAddress.recipientNamePlaceholder}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 disabled:opacity-50"
            aria-invalid={!!errors.recipientName}
            aria-describedby={errors.recipientName ? "recipientName-error" : undefined}
          />
          {errors.recipientName && (
            <p id="recipientName-error" className="mt-1.5 text-sm text-red-500" role="alert">
              {errors.recipientName}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="deliveryPhone" className="block text-sm font-medium mb-2">
            {dictionary.checkout.deliveryAddress.phone}
          </label>
          <input
            type="tel"
            id="deliveryPhone"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder={dictionary.checkout.deliveryAddress.phonePlaceholder}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 disabled:opacity-50"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "deliveryPhone-error" : undefined}
          />
          {errors.phone && (
            <p id="deliveryPhone-error" className="mt-1.5 text-sm text-red-500" role="alert">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Country and City */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="country" className="block text-sm font-medium mb-2">
              {dictionary.checkout.deliveryAddress.country}
            </label>
            <input
              type="text"
              id="country"
              value={formData.country}
              onChange={(e) => handleChange("country", e.target.value)}
              placeholder={dictionary.checkout.deliveryAddress.countryPlaceholder}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 disabled:opacity-50"
              aria-invalid={!!errors.country}
              aria-describedby={errors.country ? "country-error" : undefined}
            />
            {errors.country && (
              <p id="country-error" className="mt-1.5 text-sm text-red-500" role="alert">
                {errors.country}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-2">
              {dictionary.checkout.deliveryAddress.city}
            </label>
            <input
              type="text"
              id="city"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder={dictionary.checkout.deliveryAddress.cityPlaceholder}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 disabled:opacity-50"
              aria-invalid={!!errors.city}
              aria-describedby={errors.city ? "city-error" : undefined}
            />
            {errors.city && (
              <p id="city-error" className="mt-1.5 text-sm text-red-500" role="alert">
                {errors.city}
              </p>
            )}
          </div>
        </div>

        {/* Address Line */}
        <div>
          <label htmlFor="addressLine" className="block text-sm font-medium mb-2">
            {dictionary.checkout.deliveryAddress.addressLine}
          </label>
          <input
            type="text"
            id="addressLine"
            value={formData.addressLine}
            onChange={(e) => handleChange("addressLine", e.target.value)}
            placeholder={dictionary.checkout.deliveryAddress.addressLinePlaceholder}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 disabled:opacity-50"
            aria-invalid={!!errors.addressLine}
            aria-describedby={errors.addressLine ? "addressLine-error" : undefined}
          />
          {errors.addressLine && (
            <p id="addressLine-error" className="mt-1.5 text-sm text-red-500" role="alert">
              {errors.addressLine}
            </p>
          )}
        </div>

        {/* Apartment Details */}
        <div>
          <label htmlFor="apartmentDetails" className="block text-sm font-medium mb-2">
            {dictionary.checkout.deliveryAddress.apartmentDetails}
          </label>
          <input
            type="text"
            id="apartmentDetails"
            value={formData.apartmentDetails}
            onChange={(e) => handleChange("apartmentDetails", e.target.value)}
            placeholder={dictionary.checkout.deliveryAddress.apartmentDetailsPlaceholder}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 disabled:opacity-50"
          />
        </div>

        {/* Delivery Instructions */}
        <div>
          <label htmlFor="deliveryInstructions" className="block text-sm font-medium mb-2">
            {dictionary.checkout.deliveryAddress.deliveryInstructions}
          </label>
          <textarea
            id="deliveryInstructions"
            value={formData.deliveryInstructions}
            onChange={(e) => handleChange("deliveryInstructions", e.target.value)}
            placeholder={dictionary.checkout.deliveryAddress.deliveryInstructionsPlaceholder}
            rows={3}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 disabled:opacity-50 resize-none"
          />
        </div>

        {/* Location Assistance */}
        <div className="rounded-xl border border-border bg-background/60 p-4">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-5 text-muted" aria-hidden />
            <div className="flex-1">
              <p className="text-sm font-medium">
                {dictionary.checkout.deliveryAddress.useCurrentLocation}
              </p>
              <p className="mt-1 text-xs text-muted">
                {dictionary.checkout.deliveryAddress.locationExplanation}
              </p>
              {formData.coordinates && (
                <p className="mt-2 text-xs text-green-600">
                  ✓ Location captured: {formData.coordinates.latitude.toFixed(4)}, {formData.coordinates.longitude.toFixed(4)}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleGetLocation}
              disabled={isGettingLocation}
              className="shrink-0"
            >
              {isGettingLocation ? (
                "Getting location..."
              ) : (
                <>
                  <Navigation className="mr-2 size-4" aria-hidden />
                  Get Location
                </>
              )}
            </Button>
          </div>
          {locationError && (
            <p className="mt-3 text-sm text-amber-600" role="alert">
              {locationError}
            </p>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleBack}
            className="flex-1"
          >
            Back
          </Button>
          <Button type="submit" className="flex-1" size="lg">
            {dictionary.checkout.deliveryAddress.continue}
          </Button>
        </div>
      </form>
    </div>
  );
}
