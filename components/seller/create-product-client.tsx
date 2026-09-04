"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function CreateProductClient({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    sku: "",
    initial_stock: "0",
    category_id: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8080/api/products/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.data.url);
      } else {
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        initial_stock: parseInt(formData.initial_stock),
        current_stock: parseInt(formData.initial_stock),
        images: imageUrl ? [imageUrl] : [],
      };

      const response = await fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push("/seller/products");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create product");
      }
    } catch (error) {
      console.error("Failed to create product:", error);
      alert("Failed to create product");
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
        <h1 className="text-3xl font-bold mb-6">Create Product</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Product name"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              rows={4}
              placeholder="Product description"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-2">
              Price *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              required
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="sku" className="block text-sm font-medium mb-2">
              SKU
            </label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="SKU"
            />
          </div>

          <div>
            <label htmlFor="initial_stock" className="block text-sm font-medium mb-2">
              Initial Stock *
            </label>
            <input
              type="number"
              id="initial_stock"
              name="initial_stock"
              required
              value={formData.initial_stock}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium mb-2">
              Product Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {uploading && <p className="text-sm text-muted mt-2">Uploading...</p>}
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Product preview"
                className="mt-4 h-32 w-32 object-cover rounded"
              />
            )}
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading || uploading}>
              {loading ? "Creating..." : "Create Product"}
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
