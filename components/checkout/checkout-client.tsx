"use client";

import { useCart } from "@/lib/cart";
import { useCheckout } from "@/lib/checkout";
import { ButtonLink } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n/types";
import { CustomerDetailsForm } from "./customer-details-form";
import { DeliveryAddressForm } from "./delivery-address-form";
import { PaymentMethodForm } from "./payment-method-form";
import { OrderReview } from "./order-review";
import { OrderConfirmation } from "./order-confirmation";

export function CheckoutClient({ dictionary }: { dictionary: Dictionary }) {
  const { items, storeName, subtotal, currency } = useCart();
  const { step } = useCheckout();

  // Handle empty cart
  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-12 text-center">
        <p className="text-lg font-medium">{dictionary.checkout.emptyCart}</p>
        <p className="mt-2 text-sm text-muted">
          {dictionary.checkout.emptyCartDescription}
        </p>
        <div className="mt-8 flex justify-center">
          <ButtonLink href="/explore">{dictionary.checkout.keepShopping}</ButtonLink>
        </div>
      </div>
    );
  }

  // Render appropriate step
  const renderStep = () => {
    switch (step) {
      case "customer-details":
        return <CustomerDetailsForm dictionary={dictionary} />;
      case "delivery-address":
        return <DeliveryAddressForm dictionary={dictionary} />;
      case "payment-method":
        return <PaymentMethodForm dictionary={dictionary} />;
      case "order-review":
        return <OrderReview dictionary={dictionary} />;
      case "confirmation":
        return <OrderConfirmation dictionary={dictionary} />;
      default:
        return <CustomerDetailsForm dictionary={dictionary} />;
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      {/* Main checkout content */}
      <div>
        {/* Store Identity */}
        {storeName && (
          <div className="mb-6 rounded-xl border border-border bg-background/60 p-4">
            <p className="text-sm text-muted">Shopping from</p>
            <p className="mt-1 font-medium">{storeName}</p>
          </div>
        )}

        {/* Step content */}
        {renderStep()}
      </div>

      {/* Order Summary Sidebar */}
      {step !== "confirmation" && (
        <aside className="h-fit rounded-3xl border border-border bg-surface p-6 lg:sticky lg:top-8">
          <h2 className="text-sm font-semibold tracking-wide uppercase">
            {dictionary.checkout.orderReview.orderSummary}
          </h2>
          
          {/* Cart items preview */}
          <div className="mt-5 space-y-4">
            {items.slice(0, 3).map((item) => (
              <div key={item.productId} className="flex items-center gap-3">
                <div
                  role="img"
                  aria-label={item.product.image.alt}
                  className={`size-12 shrink-0 rounded-lg bg-gradient-to-br ${item.product.image.gradient}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.product.name}</p>
                  <p className="text-xs text-muted">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold">
                  {item.product.price.currency === "USD" ? "$" : ""}{(item.product.price.amount * item.quantity / 100).toFixed(2)}
                </p>
              </div>
            ))}
            
            {items.length > 3 && (
              <p className="text-sm text-muted">
                +{items.length - 3} more {dictionary.checkout.orderReview.items}
              </p>
            )}
          </div>

          {/* Price breakdown */}
          <dl className="mt-6 space-y-3 text-sm border-t border-border pt-4">
            <div className="flex justify-between">
              <dt className="text-muted">{dictionary.checkout.orderReview.subtotal}</dt>
              <dd>{currency === "USD" ? "$" : ""}{(subtotal / 100).toFixed(2)}</dd>
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
              <dd>{currency === "USD" ? "$" : ""}{(subtotal / 100).toFixed(2)}</dd>
            </div>
          </dl>
        </aside>
      )}
    </div>
  );
}
