"use client";

import Link from "next/link";
import type { ActiveLocale } from "@/config/i18n";
import type { Product } from "@/lib/commerce/types";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/utils";

export function ProductCard({
  product,
  badgeLabel,
  locale,
}: {
  product: Product;
  /** Localised label for `product.badge`; omitted when the product has none. */
  badgeLabel?: string;
  locale: ActiveLocale;
}) {
  return (
    <Link 
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-foreground/25"
    >
      <div className="relative overflow-hidden">
        <div
          role="img"
          aria-label={product.image.alt}
          className={`h-40 bg-gradient-to-br ${product.image.gradient} transition-transform duration-500 group-hover:scale-[1.03]`}
        />
        {badgeLabel ? (
          <span className="absolute top-3 start-3">
            <Badge className="bg-background/70 text-foreground backdrop-blur">
              {badgeLabel}
            </Badge>
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs tracking-wide text-muted uppercase">
          {product.storeName}
        </p>
        <h3 className="mt-2 text-base font-medium">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">
          {product.description}
        </p>
        <p className="mt-4 text-sm font-semibold">
          {formatMoney(product.price, locale)}
        </p>
      </div>
    </Link>
  );
}
