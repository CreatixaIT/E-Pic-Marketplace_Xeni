"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function CreateShopClient({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shop_name: "",
    shop_description: "",
    district: "",
    preferred_language: "en",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/shops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/seller/dashboard");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create shop");
      }
    } catch (error) {
      console.error("Failed to create shop:", error);
      alert("Failed to create shop");
    } finally {
      setLoading(false);
    }
  };

  const getAccessToken = (): string => {
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    return cookies.gateway_access_token || "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create Your Shop</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="shop_name" className="block text-sm font-medium mb-2">
              Shop Name *
            </label>
            <input
              type="text"
              id="shop_name"
              name="shop_name"
              required
              value={formData.shop_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Your shop name"
            />
          </div>

          <div>
            <label htmlFor="shop_description" className="block text-sm font-medium mb-2">
              Shop Description
            </label>
            <textarea
              id="shop_description"
              name="shop_description"
              value={formData.shop_description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              rows={4}
              placeholder="Describe your shop"
            />
          </div>

          <div>
            <label htmlFor="district" className="block text-sm font-medium mb-2">
              District
            </label>
            <input
              type="text"
              id="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Your district"
            />
          </div>

          <div>
            <label htmlFor="preferred_language" className="block text-sm font-medium mb-2">
              Preferred Language
            </label>
            <select
              id="preferred_language"
              name="preferred_language"
              value={formData.preferred_language}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="en">English</option>
              <option value="bn">Bangla</option>
            </select>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Shop"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
