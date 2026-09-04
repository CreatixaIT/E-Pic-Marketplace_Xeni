"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { ShoppingCart, ArrowLeft, Check } from "lucide-react";
import { useCart } from "@/lib/cart/provider";

type CartItem = {
  productId: string;
  product: any;
  quantity: number;
};

export function CheckoutClient({ userId }: { userId: string }) {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");

  const getAccessToken = (): string => {
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    return cookies.gateway_access_token || "";
  };

  const handleCheckout = async () => {
    if (!customerName || !customerPhone || !customerAddress) {
      alert("Please fill in all customer details");
      return;
    }

    if (items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_address: customerAddress,
          payment_method: paymentMethod,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrderId(data.data.id);
        setOrderComplete(true);
        clearCart();
      } else {
        const error = await response.json();
        alert(error.error || "Checkout failed");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <Container>
        <Section>
          <div className="max-w-md mx-auto border rounded-3xl p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4">Order Placed Successfully!</h2>
            <p className="text-muted mb-2">Your order has been placed successfully.</p>
            <p className="text-sm text-muted mb-6">Order ID: {orderId.slice(0, 8)}...</p>
            <div className="space-y-3">
              <Button onClick={() => router.push("/account/orders")} className="w-full">
                View My Orders
              </Button>
              <Button variant="secondary" onClick={() => router.push("/")} className="w-full">
                Continue Shopping
              </Button>
            </div>
          </div>
        </Section>
      </Container>
    );
  }

  return (
    <Container>
      <Section>
        <Button variant="secondary" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-3xl p-6">
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  id="name"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  id="phone"
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-2">Delivery Address</label>
                <input
                  id="address"
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Enter your delivery address"
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="payment" className="block text-sm font-medium mb-2">Payment Method</label>
                <select
                  id="payment"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="cod">Cash on Delivery</option>
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border rounded-3xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Order Summary
            </h2>
            {items.length === 0 ? (
              <p className="text-center text-muted py-8">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${(item.product.price.amount * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted">
                        ${item.product.price.amount.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  onClick={handleCheckout}
                  disabled={loading || items.length === 0}
                  className="w-full"
                >
                  {loading ? "Processing..." : "Place Order"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Section>
    </Container>
  );
}
