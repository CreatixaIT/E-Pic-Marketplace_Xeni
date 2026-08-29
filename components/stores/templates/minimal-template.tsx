import type { Store, Product } from "@/lib/commerce/types";
import { ProductGrid } from "@/components/products/product-grid";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import type { ActiveLocale } from "@/config/i18n";
import type { Dictionary } from "@/lib/i18n/types";

interface MinimalTemplateProps {
  store: Store;
  products: Product[];
  dictionary: Dictionary;
  locale: ActiveLocale;
}

export function MinimalTemplate({
  store,
  products,
  dictionary,
  locale,
}: MinimalTemplateProps) {
  return (
    <>
      {/* Minimal Hero */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium tracking-wide uppercase text-muted">
              {store.categoryLabel}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {store.name}
            </h1>
            <p className="mt-4 text-lg text-muted">{store.tagline}</p>
            <div className="mt-8 flex items-center justify-center gap-4 text-sm text-muted">
              <span>{store.location}</span>
              <span>·</span>
              <span>{store.productCount} {dictionary.worlds.products}</span>
            </div>
            <div className="mt-8 flex justify-center gap-3">
              <ButtonLink href="/explore" variant="secondary">
                {dictionary.worlds.viewAllStores}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Story */}
      {store.visualConfig.brandStory && (
        <Section className="bg-background">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-xl font-semibold">
              {store.visualConfig.brandStory.title}
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              {store.visualConfig.brandStory.content}
            </p>
          </div>
        </Section>
      )}

      {/* Products */}
      <Section>
        <SectionHeading eyebrow="Catalogue" title={store.tagline} />
        <div className="mt-12">
          <ProductGrid
            products={products}
            badges={dictionary.badges}
            locale={locale}
          />
        </div>
      </Section>
    </>
  );
}