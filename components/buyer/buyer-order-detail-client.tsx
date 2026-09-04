"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";

type Order = {
  id: string;
  customer_name?: string;
  customer_phone?: string;
  customer_address?: string;
  order_items: any[];
  total_amount: number;
  payment_status: string;
  delivery_status: string;
  payment_trx_id?: string;
  tracking_number?: string;
  created_at: string;
};

export function BuyerOrderDetailClient({ orderId, userId }: { orderId: string; userId: string }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Order not found</h1>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="secondary" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Orders
      </Button>

      <div className="border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Order Details</h1>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted">Order ID</p>
            <p className="font-mono text-sm">{order.id}</p>
          </div>
          <div>
            <p className="text-sm text-muted">Date</p>
            <p>{new Date(order.created_at).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted">Customer Name</p>
            <p>{order.customer_name || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted">Customer Phone</p>
            <p>{order.customer_phone || "N/A"}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-muted">Customer Address</p>
            <p>{order.customer_address || "N/A"}</p>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
        <div className="space-y-2">
          {order.order_items.map((item: any, index: number) => (
            <div key={index} className="flex justify-between p-3 border rounded">
              <div>
                <p className="font-medium">Product ID: {item.product_id}</p>
                <p className="text-sm text-muted">Quantity: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                <p className="text-sm text-muted">${item.price.toFixed(2)} each</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-semibold">${order.total_amount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Status</h2>
        <span className={`px-3 py-1 rounded text-sm ${
          order.payment_status === "verified" ? "bg-green-100 text-green-800" :
          order.payment_status === "pending" ? "bg-yellow-100 text-yellow-800" :
          "bg-red-100 text-red-800"
        }`}>
          {order.payment_status}
        </span>
        {order.payment_trx_id && (
          <p className="text-sm text-muted mt-2">
            Transaction ID: {order.payment_trx_id}
          </p>
        )}
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Delivery Status</h2>
        <span className={`px-3 py-1 rounded text-sm ${
          order.delivery_status === "delivered" ? "bg-green-100 text-green-800" :
          order.delivery_status === "in_transit" ? "bg-blue-100 text-blue-800" :
          "bg-gray-100 text-gray-800"
        }`}>
          {order.delivery_status}
        </span>
        {order.tracking_number && (
          <p className="text-sm text-muted mt-2">
            Tracking Number: {order.tracking_number}
          </p>
        )}
      </div>
    </div>
  );
}
