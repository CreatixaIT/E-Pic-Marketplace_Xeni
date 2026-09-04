"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Store, Package, ShoppingBag, Settings, LogOut } from "lucide-react";

type ShopData = {
  id: string;
  shop_name: string;
  shop_description?: string;
  shop_logo_url?: string;
};

type Stats = {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
};

export function SellerDashboardClient({ userId }: { userId: string }) {
  const router = useRouter();
  const [shop, setShop] = useState<ShopData | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShopData();
    fetchStats();
  }, [userId]);

  const fetchShopData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/shops/me", {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setShop(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch shop data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch products count
      const productsResponse = await fetch("http://localhost:8080/api/products", {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });

      // Fetch orders count
      const ordersResponse = await fetch("http://localhost:8080/api/orders", {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });

      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setStats((prev) => ({ ...prev, totalProducts: productsData.data?.length || 0 }));
      }

      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setStats((prev) => ({ ...prev, totalOrders: ordersData.data?.length || 0 }));
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const getAccessToken = (): string => {
    // Helper to get access token from cookies
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    return cookies.gateway_access_token || "";
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Create Your Shop</h1>
          <p className="text-muted mb-6">
            You need to create a shop before you can start selling products.
          </p>
          <Button onClick={() => router.push("/seller/shop/create")} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Create Shop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{shop.shop_name}</h1>
          {shop.shop_description && (
            <p className="text-muted mt-1">{shop.shop_description}</p>
          )}
        </div>
        <Button variant="secondary" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Total Products</p>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </div>
            <Package className="h-8 w-8 text-muted" />
          </div>
        </div>
        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Total Orders</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-muted" />
          </div>
        </div>
        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Total Revenue</p>
              <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
            </div>
            <Store className="h-8 w-8 text-muted" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button
          variant="secondary"
          className="h-24 flex-col"
          onClick={() => router.push("/seller/products")}
        >
          <Package className="h-6 w-6 mb-2" />
          Products
        </Button>
        <Button
          variant="secondary"
          className="h-24 flex-col"
          onClick={() => router.push("/seller/orders")}
        >
          <ShoppingBag className="h-6 w-6 mb-2" />
          Orders
        </Button>
        <Button
          variant="secondary"
          className="h-24 flex-col"
          onClick={() => router.push("/seller/shop/settings")}
        >
          <Settings className="h-6 w-6 mb-2" />
          Shop Settings
        </Button>
        <Button
          variant="secondary"
          className="h-24 flex-col"
          onClick={() => router.push("/seller/shop")}
        >
          <Store className="h-6 w-6 mb-2" />
          View Shop
        </Button>
      </div>
    </div>
  );
}
