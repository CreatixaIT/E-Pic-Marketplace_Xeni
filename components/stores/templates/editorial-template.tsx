import type { Store, Product } from "@/lib/commerce/types";
import { ProductGrid } from "@/components/products/product-grid";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import type { ActiveLocale } from "@/config/i18n";
import type { Dictionary } from "@/lib/i18n/types";

interface EditorialTemplateProps {
  store: Store;
  products: Product[];
  dictionary: Dictionary;
  locale: ActiveLocale;
}

export function EditorialTemplate({
  store,
  products,
  dictionary,
  locale,
}: EditorialTemplateProps) {
  return (
    <>
      {/* Editorial Hero */}
      <div className="relative overflow-hidden bg-surface">
        <div
          aria-hidden
          className={`absolute inset-0 bg-gradient-to-br ${store.theme.gradient} opacity-20`}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium tracking-wide uppercase text-muted">
              {store.categoryLabel}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              {store.name}
            </h1>
            <p className="mt-6 text-xl text-muted leading-relaxed">
              {store.visualConfig.hero?.description || store.tagline}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted">
              <span>{store.location}</span>
              <span>·</span>
              <span>{store.productCount} {dictionary.worlds.products}</span>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
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
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-semibold">
              {store.visualConfig.brandStory.title}
            </h2>
            <p className="mt-6 text-lg text-muted leading-relaxed">
              {store.visualConfig.brandStory.content}
            </p>
          </div>
        </Section>
      )}

      {/* Featured Collection */}
      {store.visualConfig.featuredCollectionIds && store.visualConfig.featuredCollectionIds.length > 0 && (
        <Section className="bg-surface">
          <SectionHeading eyebrow="Featured" title="Curated Selection" />
          <div className="mt-12">
            <ProductGrid
              products={products.slice(0, 6)}
              badges={dictionary.badges}
              locale={locale}
            />
          </div>
        </Section>
      )}

      {/* Full Catalogue */}
      <Section>
        <SectionHeading eyebrow="Catalogue" title="All Products" />
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