"use client";

import { useState, useEffect } from "react";
import { useDictionary } from "@/lib/i18n/client";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Pencil, Trash2, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Address {
  id: string;
  recipientName: string;
  phone: string;
  country: string;
  city: string;
  addressLine: string;
  apartmentDetails?: string | null;
  deliveryInstructions?: string | null;
  label: string;
  isDefault: boolean;
}

interface AddressesSectionProps {
  userId: string;
}

export function AddressesSection({}: AddressesSectionProps) {
  const dict = useDictionary();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState({
    recipientName: "",
    phone: "",
    country: "",
    city: "",
    addressLine: "",
    apartmentDetails: "",
    deliveryInstructions: "",
    label: "OTHER",
  });

  const fetchAddresses = async () => {
    try {
      const response = await fetch("/api/account/addresses");
      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses || []);
      }
    } catch {
      // Silent fail
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Defer the fetch to avoid synchronous setState in effect
    const timer = setTimeout(() => {
      fetchAddresses();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const url = editingAddress
        ? `/api/account/addresses/${editingAddress.id}`
        : "/api/account/addresses";
      const method = editingAddress ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        setMessage({ type: "error", text: dict.account.addressError });
        return;
      }

      setMessage({
        type: "success",
        text: editingAddress
          ? dict.account.addressUpdated
          : dict.account.addressAdded,
      });

      setShowForm(false);
      setEditingAddress(null);
      setFormData({
        recipientName: "",
        phone: "",
        country: "",
        city: "",
        addressLine: "",
        apartmentDetails: "",
        deliveryInstructions: "",
        label: "OTHER",
      });

      // Reload addresses
      fetchAddresses();
    } catch {
      setMessage({ type: "error", text: dict.account.addressError });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      recipientName: address.recipientName,
      phone: address.phone,
      country: address.country,
      city: address.city,
      addressLine: address.addressLine,
      apartmentDetails: address.apartmentDetails || "",
      deliveryInstructions: address.deliveryInstructions || "",
      label: address.label,
    });
    setShowForm(true);
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/account/addresses/${addressId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setMessage({ type: "error", text: dict.account.addressError });
        return;
      }

      setMessage({ type: "success", text: dict.account.addressDeleted });
      
      // Reload addresses
      fetchAddresses();
    } catch {
      setMessage({ type: "error", text: dict.account.addressError });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/account/addresses/${addressId}?action=setDefault`, {
        method: "PATCH",
      });

      if (!response.ok) {
        setMessage({ type: "error", text: dict.account.addressError });
        return;
      }

      setMessage({ type: "success", text: dict.account.addressSetDefault });
      
      // Reload addresses
      fetchAddresses();
    } catch {
      setMessage({ type: "error", text: dict.account.addressError });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
    setFormData({
      recipientName: "",
      phone: "",
      country: "",
      city: "",
      addressLine: "",
      apartmentDetails: "",
      deliveryInstructions: "",
      label: "OTHER",
    });
    setMessage(null);
  };

  if (isLoading && addresses.length === 0) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{dict.account.addresses}</h2>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="size-4 mr-2" />
            {dict.account.addAddress}
          </Button>
        )}
      </div>

      {message && (
        <div
          className={cn(
            "p-4 rounded-lg",
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          )}
        >
          {message.text}
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 border border-border rounded-lg">
          <h3 className="font-semibold text-lg mb-4">
            {editingAddress ? dict.account.editAddress : dict.account.addAddress}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="label" className="block text-sm font-medium mb-2">
                {dict.account.addressLabel}
              </label>
              <select
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
              >
                <option value="HOME">{dict.account.labelHome}</option>
                <option value="OFFICE">{dict.account.labelOffice}</option>
                <option value="OTHER">{dict.account.labelOther}</option>
              </select>
            </div>

            <div>
              <label htmlFor="recipientName" className="block text-sm font-medium mb-2">
                {dict.account.recipientName}
              </label>
              <input
                id="recipientName"
                type="text"
                value={formData.recipientName}
                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                placeholder={dict.account.recipientNamePlaceholder}
                required
                className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                {dict.account.phone}
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder={dict.account.phonePlaceholder}
                required
                className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-2">
                {dict.account.country}
              </label>
              <input
                id="country"
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder={dict.account.countryPlaceholder}
                required
                className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="city" className="block text-sm font-medium mb-2">
                {dict.account.city}
              </label>
              <input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder={dict.account.cityPlaceholder}
                required
                className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="addressLine" className="block text-sm font-medium mb-2">
                {dict.account.addressLine}
              </label>
              <input
                id="addressLine"
                type="text"
                value={formData.addressLine}
                onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                placeholder={dict.account.addressLinePlaceholder}
                required
                className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="apartmentDetails" className="block text-sm font-medium mb-2">
                {dict.account.apartmentDetails}
              </label>
              <input
                id="apartmentDetails"
                type="text"
                value={formData.apartmentDetails}
                onChange={(e) => setFormData({ ...formData, apartmentDetails: e.target.value })}
                placeholder={dict.account.apartmentDetailsPlaceholder}
                className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="deliveryInstructions" className="block text-sm font-medium mb-2">
                {dict.account.deliveryInstructions}
              </label>
              <textarea
                id="deliveryInstructions"
                value={formData.deliveryInstructions}
                onChange={(e) => setFormData({ ...formData, deliveryInstructions: e.target.value })}
                placeholder={dict.account.deliveryInstructionsPlaceholder}
                rows={2}
                className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? dict.account.save + "..." : dict.account.save}
            </Button>
            <Button type="button" variant="secondary" onClick={handleCancel}>
              {dict.account.cancel}
            </Button>
          </div>
        </form>
      ) : (
        <>
          {addresses.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <MapPin className="size-8 text-muted" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{dict.account.noAddresses}</h3>
              <p className="text-muted max-w-md mx-auto">
                {dict.account.noAddressesDescription}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="p-4 border border-border rounded-lg space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-muted">
                        {address.label === "HOME"
                          ? dict.account.labelHome
                          : address.label === "OFFICE"
                          ? dict.account.labelOffice
                          : dict.account.labelOther}
                      </span>
                      {address.isDefault && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-accent">
                          <Star className="size-3 fill-current" />
                          {dict.account.defaultAddress}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!address.isDefault && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSetDefault(address.id)}
                          title={dict.account.setDefault}
                        >
                          <Star className="size-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(address)}
                        title={dict.account.editAddress}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(address.id)}
                        title={dict.account.deleteAddress}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">{address.recipientName}</p>
                    <p className="text-sm text-muted">{address.phone}</p>
                  </div>

                  <div className="text-sm">
                    <p>{address.addressLine}</p>
                    {address.apartmentDetails && <p>{address.apartmentDetails}</p>}
                    <p>
                      {address.city}, {address.country}
                    </p>
                    {address.deliveryInstructions && (
                      <p className="text-muted mt-1">{address.deliveryInstructions}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}