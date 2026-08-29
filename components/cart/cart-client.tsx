"use client";

import { Lock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatMoney } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/types";

export function CartClient({ dictionary }: { dictionary: Dictionary }) {
  const {
    items,
    storeName,
    itemCount,
    subtotal,
    currency,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-12 text-center">
        <p className="text-lg font-medium">{dictionary.cart.empty}</p>
        <p className="mt-2 text-sm text-muted">
          {dictionary.cart.emptyDescription}
        </p>
        <div className="mt-8 flex justify-center">
          <ButtonLink href="/explore">{dictionary.cart.keepShopping}</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      {/* Cart Items */}
      <div>
        {/* Store Identity */}
        {storeName && (
          <div className="mb-6 rounded-xl border border-border bg-background/60 p-4">
            <p className="text-sm text-muted">Shopping from</p>
            <p className="mt-1 font-medium">{storeName}</p>
          </div>
        )}

        <ul className="divide-y divide-border rounded-3xl border border-border bg-surface">
          {items.map((item) => (
            <li key={item.productId} className="flex items-center gap-5 p-5">
              <div
                role="img"
                aria-label={item.product.image.alt}
                className={`size-20 shrink-0 rounded-xl bg-gradient-to-br ${item.product.image.gradient}`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs tracking-wide text-muted uppercase">
                  {item.product.storeName}
                </p>
                <h2 className="mt-1 truncate text-base font-medium">
                  {item.product.name}
                </h2>
                <p className="mt-2 text-sm font-semibold">
                  {formatMoney(item.product.price)}
                </p>
                
                {/* Quantity Controls */}
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center rounded-lg border border-border bg-background">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="flex size-8 items-center justify-center rounded-l-lg border-r border-border text-muted transition-colors hover:bg-foreground/5 disabled:opacity-50 disabled:hover:bg-transparent"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="flex size-8 items-center justify-center rounded-r-lg border-l border-border text-muted transition-colors hover:bg-foreground/5"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-red-500"
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                    {dictionary.cart.remove}
                  </button>
                </div>
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

        {/* Clear Cart */}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={clearCart}
            className="text-sm text-muted transition-colors hover:text-red-500"
          >
            {dictionary.cart.clearCart}
          </button>
        </div>
      </div>

      {/* Summary */}
      <aside className="h-fit rounded-3xl border border-border bg-surface p-6">
        <h2 className="text-sm font-semibold tracking-wide uppercase">
          Summary
        </h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">
              {dictionary.cart.subtotal} ({itemCount} {dictionary.cart.items})
            </dt>
            <dd>{formatMoney({ amount: subtotal, currency })}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Shipping</dt>
            <dd className="text-muted">Calculated at checkout</dd>
          </div>
        </dl>
        
        {/* Checkout Placeholder */}
        <div className="mt-6 rounded-xl border border-border bg-background/60 p-4">
          <div className="flex items-start gap-3">
            <Lock className="mt-0.5 size-4 text-muted" aria-hidden />
            <div>
              <p className="text-sm font-medium">{dictionary.cart.checkoutComing}</p>
              <p className="mt-1 text-xs text-muted">
                Checkout functionality will be added in a future milestone.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <Button disabled className="w-full">
            {dictionary.cart.checkout}
          </Button>
        </div>

        <div className="mt-4">
          <ButtonLink href="/explore" variant="secondary" className="w-full">
            {dictionary.cart.keepShopping}
          </ButtonLink>
        </div>
      </aside>
    </div>
  );
}