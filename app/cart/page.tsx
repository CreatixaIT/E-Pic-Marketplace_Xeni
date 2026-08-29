import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { getCommerceProvider } from "@/lib/commerce";
import { formatMoney } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your E-pic bag. Checkout arrives with the commerce integration.",
};

export default async function CartPage() {
  const cart = await getCommerceProvider().getCart();

  return (
    <>
      <PageHeader
        eyebrow="Cart"
        title="Your bag"
        description="A read-only preview backed by mock data. Quantities, checkout and payments land once the commerce integration is connected."
      />

      <Section>
        {cart.lines.length === 0 ? (
          <div className="rounded-3xl border border-border bg-surface p-12 text-center">
            <p className="text-lg font-medium">Your bag is empty</p>
            <p className="mt-2 text-sm text-muted">
              Find a world you like and start there.
            </p>
            <div className="mt-8 flex justify-center">
              <ButtonLink href="/explore">Explore stores</ButtonLink>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
            <ul className="divide-y divide-border rounded-3xl border border-border bg-surface">
              {cart.lines.map((line) => (
                <li key={line.id} className="flex items-center gap-5 p-5">
                  <div
                    role="img"
                    aria-label={line.product.image.alt}
                    className={`size-20 shrink-0 rounded-xl bg-gradient-to-br ${line.product.image.gradient}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs tracking-wide text-muted uppercase">
                      {line.product.storeName}
                    </p>
                    <h2 className="mt-1 truncate text-base font-medium">
                      {line.product.name}
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                      Qty {line.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatMoney({
                      amount: line.product.price.amount * line.quantity,
                      currency: line.product.price.currency,
                    })}
                  </p>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-3xl border border-border bg-surface p-6">
              <h2 className="text-sm font-semibold tracking-wide uppercase">
                Summary
              </h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd>{formatMoney(cart.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Shipping</dt>
                  <dd className="text-muted">Calculated at checkout</dd>
                </div>
              </dl>
              <p className="mt-6 flex items-start gap-2 rounded-xl border border-border bg-background/60 p-3 text-xs leading-relaxed text-muted">
                <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                Checkout is disabled in this preview. No payment provider is
                connected.
              </p>
              <div className="mt-5">
                <ButtonLink href="/explore" variant="secondary" className="w-full">
                  Keep exploring
                </ButtonLink>
              </div>
            </aside>
          </div>
        )}
      </Section>
    </>
  );
}
