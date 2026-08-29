"use client";

import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductGrid } from "@/components/products/product-grid";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import type { ActiveLocale } from "@/config/i18n";
import type { Category, CategoryId, Product } from "@/lib/commerce/types";
import { interpolate } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n/types";
import { cn } from "@/lib/utils";

type Filter = CategoryId | "all";

/**
 * Immediate product discovery. Filtering happens over the products handed in
 * as props — the component never reaches into the commerce layer itself.
 */
export function ProductDiscovery({
  products,
  categories,
  copy,
  badges,
  locale,
}: {
  products: Product[];
  categories: Category[];
  copy: Dictionary["discovery"];
  badges: Dictionary["badges"];
  locale: ActiveLocale;
}) {
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(
    () =>
      filter === "all"
        ? products
        : products.filter((product) => product.category === filter),
    [filter, products],
  );

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: copy.allCategories },
    ...categories.map((category) => ({
      id: category.id as Filter,
      label: category.label,
    })),
  ];

  return (
    <Section id="explore" className="border-y border-border bg-surface-2/60">
      <SectionHeading
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        action={
          <ButtonLink href="/explore" variant="secondary">
            {copy.viewAll}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </ButtonLink>
        }
      />

      <div
        role="group"
        aria-label={copy.title}
        className="mt-10 flex flex-wrap gap-2"
      >
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              filter === item.id
                ? "border-transparent bg-foreground text-background"
                : "border-border text-muted hover:border-foreground/30 hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted">
        {interpolate(copy.resultCount, { count: visible.length })}
      </p>

      <div className="mt-8">
        {visible.length > 0 ? (
          <ProductGrid
            products={visible}
            badges={badges}
            locale={locale}
            columns={4}
          />
        ) : (
          <p className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
            {copy.empty}
          </p>
        )}
      </div>
    </Section>
  );
}
