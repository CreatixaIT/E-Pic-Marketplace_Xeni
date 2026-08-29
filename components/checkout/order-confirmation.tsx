"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { useCheckout } from "@/lib/checkout";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/types";

export function OrderConfirmation({ dictionary }: { dictionary: Dictionary }) {
  const router = useRouter();
  const { customerDetails, deliveryAddress, paymentMethod, resetCheckout } = useCheckout();
  const { items, subtotal, currency } = useCart();

  // Generate a demo order number (stable across re-renders)
  const [demoOrderNumber] = useState(() => 
    `DEMO-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
  );

  const getPaymentMethodInfo = () => {
    switch (paymentMethod) {
      case "card":
        return dictionary.checkout.paymentMethod.card;
      case "mobile-wallet":
        return dictionary.checkout.paymentMethod.mobileWallet;
      case "cash-on-delivery":
        return dictionary.checkout.paymentMethod.cashOnDelivery;
      default:
        return "Unknown";
    }
  };

  const handleContinueShopping = () => {
    resetCheckout();
    router.push("/explore");
  };

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 md:p-8">
      {/* Success Icon and Title */}
      <div className="text-center">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <CheckCircle className="size-10 text-green-600 dark:text-green-400" aria-hidden />
        </div>
        <h1 className="text-2xl font-semibold">{dictionary.checkout.confirmation.title}</h1>
        
        {/* Demo Mode Badge */}
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm dark:border-amber-800 dark:bg-amber-950">
          <span className="font-medium text-amber-800 dark:text-amber-200">
            {dictionary.checkout.confirmation.demoMode}
          </span>
        </div>
        
        <p className="mt-4 text-sm text-muted">
          {dictionary.checkout.confirmation.demoDescription}
        </p>
      </div>

      {/* Order Number */}
      <div className="mt-8 rounded-xl border border-border bg-background/60 p-4 text-center">
        <p className="text-sm text-muted">{dictionary.checkout.confirmation.orderNumber}</p>
        <p className="mt-1 text-lg font-mono font-semibold">{demoOrderNumber}</p>
      </div>

      {/* Thank You Message */}
      <div className="mt-8 text-center">
        <p className="text-lg font-medium">{dictionary.checkout.confirmation.thankYou}</p>
      </div>

      {/* What Happens Next */}
      <div className="mt-8 rounded-xl border border-border bg-background/60 p-5">
        <h3 className="font-medium">{dictionary.checkout.confirmation.whatHappensNext}</h3>
        <p className="mt-2 text-sm text-muted">
          {dictionary.checkout.confirmation.whatHappensNextDescription}
        </p>
      </div>

      {/* Order Details Summary */}
      <div className="mt-8 space-y-4">
        <h3 className="text-sm font-semibold tracking-wide uppercase">Order Details</h3>
        
        {/* Customer Info */}
        <div className="rounded-lg border border-border bg-background/40 p-4">
          <p className="text-xs font-medium text-muted uppercase">Customer</p>
          <p className="mt-1 text-sm">{customerDetails?.fullName}</p>
          <p className="text-sm text-muted">{customerDetails?.email}</p>
          <p className="text-sm text-muted">{customerDetails?.phone}</p>
        </div>

        {/* Delivery Address */}
        <div className="rounded-lg border border-border bg-background/40 p-4">
          <p className="text-xs font-medium text-muted uppercase">Delivery Address</p>
          <p className="mt-1 text-sm">{deliveryAddress?.recipientName}</p>
          <p className="text-sm">{deliveryAddress?.addressLine}</p>
          {deliveryAddress?.apartmentDetails && (
            <p className="text-sm">{deliveryAddress.apartmentDetails}</p>
          )}
          <p className="text-sm text-muted">
            {deliveryAddress?.city}, {deliveryAddress?.country}
          </p>
        </div>

        {/* Payment Method */}
        <div className="rounded-lg border border-border bg-background/40 p-4">
          <p className="text-xs font-medium text-muted uppercase">Payment Method</p>
          <p className="mt-1 text-sm">{getPaymentMethodInfo()}</p>
        </div>

        {/* Items */}
        <div className="rounded-lg border border-border bg-background/40 p-4">
          <p className="text-xs font-medium text-muted uppercase">Items ({items.length})</p>
          <ul className="mt-2 space-y-2">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between text-sm">
                <span>{item.product.name} × {item.quantity}</span>
                <span className="font-medium">
                  {formatMoney({
                    amount: item.product.price.amount * item.quantity,
                    currency: item.product.price.currency,
                  })}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Total */}
        <div className="rounded-lg border border-border bg-background/40 p-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Subtotal</span>
            <span>{formatMoney({ amount: subtotal, currency })}</span>
          </div>
          <div className="mt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatMoney({ amount: subtotal, currency })}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 space-y-3">
        <Button
          onClick={handleContinueShopping}
          className="w-full"
          size="lg"
        >
          <ShoppingBag className="mr-2 size-5" aria-hidden />
          {dictionary.checkout.confirmation.continueShopping}
        </Button>
        
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => window.print()}
        >
          <ArrowRight className="mr-2 size-4" aria-hidden />
          {dictionary.checkout.confirmation.viewOrder}
        </Button>
      </div>

      {/* Note about cart */}
      <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-center dark:border-amber-800 dark:bg-amber-950">
        <p className="text-xs text-amber-800 dark:text-amber-200">
          <strong>Note:</strong> Your cart has been preserved in this demo. In the full version, 
          the cart would be cleared after successful order placement.
        </p>
      </div>
    </div>
  );
}
