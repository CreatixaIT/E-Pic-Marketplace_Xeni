"use client";

import { useState } from "react";
import { ProductGrid } from "@/components/products/product-grid";
import { Section, SectionHeading } from "@/components/ui/section";
import type { ActiveLocale } from "@/config/i18n";
import type { CollectionId, Product } from "@/lib/commerce/types";
import type { Dictionary } from "@/lib/i18n/types";
import { cn } from "@/lib/utils";

export type CollectionTab = {
  id: CollectionId;
  products: Product[];
};

/**
 * Editorial tabs. Each tab's products are derived by the commerce layer via
 * `getCollection`, so no product array is duplicated in the UI.
 */
export function CuratedCollections({
  tabs,
  copy,
  badges,
  locale,
}: {
  tabs: CollectionTab[];
  copy: Dictionary["collections"];
  badges: Dictionary["badges"];
  locale: ActiveLocale;
}) {
  const [active, setActive] = useState<CollectionId>(tabs[0]?.id ?? "trending");

  const labels: Record<CollectionId, string> = {
    trending: copy.trending,
    featured: copy.featured,
    "new-arrivals": copy.newArrivals,
  };

  const current = tabs.find((tab) => tab.id === active) ?? tabs[0];

  return (
    <Section>
      <SectionHeading
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />

      <div role="tablist" aria-label={copy.title} className="mt-10 flex flex-wrap gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`collection-tab-${tab.id}`}
            aria-selected={tab.id === active}
            aria-controls={`collection-panel-${tab.id}`}
            onClick={() => setActive(tab.id)}
            className={cn(
              "-mb-px border-b-2 px-4 py-3 text-sm transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
              tab.id === active
                ? "border-accent text-foreground"
                : "border-transparent text-muted hover:text-foreground",
            )}
          >
            {labels[tab.id]}
          </button>
        ))}
      </div>

      {current ? (
        <div
          role="tabpanel"
          id={`collection-panel-${current.id}`}
          aria-labelledby={`collection-tab-${current.id}`}
          className="mt-10"
        >
          <ProductGrid
            products={current.products}
            badges={badges}
            locale={locale}
          />
        </div>
      ) : null}
    </Section>
  );
}
