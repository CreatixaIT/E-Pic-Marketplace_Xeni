"use client";

import { useState } from "react";
import { Edit, Check, CreditCard, Smartphone, DollarSign, MapPin, Mail, Phone, User } from "lucide-react";
import { useCheckout } from "@/lib/checkout";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/types";

export function OrderReview({ dictionary }: { dictionary: Dictionary }) {
  const { 
    customerDetails, 
    deliveryAddress, 
    paymentMethod, 
    setStep, 
    advanceToNextStep,
    setIsComplete
  } = useCheckout();
  const { items, subtotal, currency } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const getPaymentMethodInfo = () => {
    switch (paymentMethod) {
      case "card":
        return {
          icon: <CreditCard className="size-5" aria-hidden />,
          label: dictionary.checkout.paymentMethod.card,
        };
      case "mobile-wallet":
        return {
          icon: <Smartphone className="size-5" aria-hidden />,
          label: dictionary.checkout.paymentMethod.mobileWallet,
        };
      case "cash-on-delivery":
        return {
          icon: <DollarSign className="size-5" aria-hidden />,
          label: dictionary.checkout.paymentMethod.cashOnDelivery,
        };
      default:
        return null;
    }
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    // Simulate order processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsComplete(true);
    advanceToNextStep();
    setIsPlacingOrder(false);
  };

  const paymentInfo = getPaymentMethodInfo();

  return (
    <div className="space-y-6">
      {/* Order Review Header */}
      <div className="rounded-3xl border border-border bg-surface p-6 md:p-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold">{dictionary.checkout.orderReview.title}</h2>
          <p className="mt-2 text-sm text-muted">
            {dictionary.checkout.orderReview.description}
          </p>
        </div>

        {/* Customer Details Section */}
        <div className="mb-6 rounded-xl border border-border bg-background/60 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="size-5 text-muted" aria-hidden />
              <div>
                <p className="text-sm font-medium">{dictionary.checkout.orderReview.customerDetails}</p>
                <p className="mt-1 text-sm">
                  {customerDetails?.fullName}
                </p>
                <div className="mt-1 flex items-center gap-4 text-sm text-muted">
                  <span className="flex items-center gap-1.5">
                    <Phone className="size-3.5" aria-hidden />
                    {customerDetails?.phone}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="size-3.5" aria-hidden />
                    {customerDetails?.email}
                  </span>
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setStep("customer-details")}
              className="shrink-0"
            >
              <Edit className="mr-2 size-4" aria-hidden />
              {dictionary.checkout.orderReview.edit}
            </Button>
          </div>
        </div>

        {/* Delivery Address Section */}
        <div className="mb-6 rounded-xl border border-border bg-background/60 p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 text-muted" aria-hidden />
              <div>
                <p className="text-sm font-medium">{dictionary.checkout.orderReview.deliveryAddress}</p>
                <p className="mt-1 text-sm">
                  {deliveryAddress?.recipientName}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {deliveryAddress?.phone}
                </p>
                <p className="mt-1 text-sm">
                  {deliveryAddress?.addressLine}
                  {deliveryAddress?.apartmentDetails && `, ${deliveryAddress.apartmentDetails}`}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {deliveryAddress?.city}, {deliveryAddress?.country}
                </p>
                {deliveryAddress?.deliveryInstructions && (
                  <p className="mt-2 text-xs text-muted italic">
                    &ldquo;{deliveryAddress.deliveryInstructions}&rdquo;
                  </p>
                )}
                {deliveryAddress?.coordinates && (
                  <p className="mt-2 text-xs text-green-600">
                    ✓ Location coordinates captured
                  </p>
                )}
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setStep("delivery-address")}
              className="shrink-0"
            >
              <Edit className="mr-2 size-4" aria-hidden />
              {dictionary.checkout.orderReview.edit}
            </Button>
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="rounded-xl border border-border bg-background/60 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {paymentInfo?.icon}
              <div>
                <p className="text-sm font-medium">{dictionary.checkout.orderReview.paymentMethod}</p>
                <p className="mt-1 text-sm">{paymentInfo?.label}</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setStep("payment-method")}
              className="shrink-0"
            >
              <Edit className="mr-2 size-4" aria-hidden />
              {dictionary.checkout.orderReview.edit}
            </Button>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="rounded-3xl border border-border bg-surface p-6 md:p-8">
        <h3 className="text-sm font-semibold tracking-wide uppercase mb-4">
          {dictionary.checkout.orderReview.orderSummary}
        </h3>
        
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.productId} className="flex items-center gap-4 py-4">
              <div
                role="img"
                aria-label={item.product.image.alt}
                className={`size-16 shrink-0 rounded-lg bg-gradient-to-br ${item.product.image.gradient}`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted uppercase">{item.product.storeName}</p>
                <p className="mt-1 truncate text-sm font-medium">{item.product.name}</p>
                <p className="mt-1 text-sm text-muted">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">
                  {formatMoney({
                    amount: item.product.price.amount * item.quantity,
                    currency: item.product.price.currency,
                  })}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* Price Breakdown */}
        <dl className="mt-6 space-y-3 text-sm border-t border-border pt-4">
          <div className="flex justify-between">
            <dt className="text-muted">
              {dictionary.checkout.orderReview.subtotal} ({items.length} {dictionary.checkout.orderReview.items})
            </dt>
            <dd>{formatMoney({ amount: subtotal, currency })}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">{dictionary.checkout.orderReview.shipping}</dt>
            <dd className="text-muted">{dictionary.checkout.orderReview.shippingPlaceholder}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">{dictionary.checkout.orderReview.taxes}</dt>
            <dd className="text-muted">{dictionary.checkout.orderReview.taxesPlaceholder}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
            <dt>{dictionary.checkout.orderReview.total}</dt>
            <dd>{formatMoney({ amount: subtotal, currency })}</dd>
          </div>
        </dl>
      </div>

      {/* Demo Notice */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>{dictionary.checkout.orderReview.demoNotice}</strong>
        </p>
      </div>

      {/* Place Order Button */}
      <Button
        type="button"
        onClick={handlePlaceOrder}
        disabled={isPlacingOrder}
        className="w-full"
        size="lg"
      >
        {isPlacingOrder ? (
          <>
            <div className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Processing...
          </>
        ) : (
          <>
            <Check className="mr-2 size-5" aria-hidden />
            {dictionary.checkout.orderReview.placeOrder}
          </>
        )}
      </Button>
    </div>
  );
}
