"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye, Package } from "lucide-react";

type Order = {
  id: string;
  customer_name?: string;
  customer_phone?: string;
  total_amount: number;
  payment_status: string;
  delivery_status: string;
  created_at: string;
};

export function OrdersListClient({ userId }: { userId: string }) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/orders", {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
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

  const handleViewOrder = (orderId: string) => {
    router.push(`/seller/orders/${orderId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 mx-auto text-muted mb-4" />
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-muted">Orders will appear here when customers make purchases</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Total</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Payment</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Delivery</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 font-mono text-sm">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{order.customer_name || "N/A"}</div>
                      <div className="text-sm text-muted">{order.customer_phone || "N/A"}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">${order.total_amount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      order.payment_status === "verified" ? "bg-green-100 text-green-800" :
                      order.payment_status === "pending" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      order.delivery_status === "delivered" ? "bg-green-100 text-green-800" :
                      order.delivery_status === "in_transit" ? "bg-blue-100 text-blue-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {order.delivery_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleViewOrder(order.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
