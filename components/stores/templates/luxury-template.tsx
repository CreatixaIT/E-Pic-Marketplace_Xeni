import type { Product, Store } from "@/lib/commerce/types";
import { ProductGrid } from "@/components/products/product-grid";
import type { ActiveLocale } from "@/config/i18n";
import type { Dictionary } from "@/lib/i18n/types";

interface LuxuryTemplateProps {
  store: Store;
  products: Product[];
  dictionary: Dictionary;
  locale: ActiveLocale;
}

export function LuxuryTemplate({ store, products, dictionary, locale }: LuxuryTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      {/* Luxury Hero */}
      <section className="relative overflow-hidden border-b border-neutral-200 dark:border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-rose-50 to-fuchsia-100 dark:from-amber-950/20 dark:via-rose-950/20 dark:to-fuchsia-950/20" />
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl">
            <div className="inline-block px-4 py-1 mb-6 text-xs font-semibold tracking-widest text-amber-900 dark:text-amber-100 uppercase bg-amber-200/50 dark:bg-amber-900/50 rounded-full">
              Premium Collection
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-6">
              {store.name}
            </h1>
            <p className="text-xl md:text-2xl text-neutral-700 dark:text-neutral-300 font-light leading-relaxed mb-8">
              {store.tagline}
            </p>
            {store.description && (
              <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-2xl">
                {store.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Our Collection
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            {products.length} luxury items available
          </p>
        </div>
        <ProductGrid products={products} badges={dictionary.badges} locale={locale} />
      </section>
    </div>
  );
}
