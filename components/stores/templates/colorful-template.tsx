import type { Product, Store } from "@/lib/commerce/types";
import { ProductGrid } from "@/components/products/product-grid";
import type { ActiveLocale } from "@/config/i18n";
import type { Dictionary } from "@/lib/i18n/types";

interface ColorfulTemplateProps {
  store: Store;
  products: Product[];
  dictionary: Dictionary;
  locale: ActiveLocale;
}

export function ColorfulTemplate({ store, products, dictionary, locale }: ColorfulTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-blue-950/20">
      {/* Colorful Hero */}
      <section className="relative overflow-hidden border-b border-neutral-200 dark:border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 dark:from-pink-600 dark:via-purple-600 dark:to-blue-600 opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-400 dark:from-cyan-600 dark:via-fuchsia-600 dark:to-amber-600 opacity-10 animate-pulse" />
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl">
            <div className="inline-block px-4 py-1 mb-6 text-xs font-semibold tracking-widest text-purple-900 dark:text-purple-100 uppercase bg-purple-200/50 dark:bg-purple-900/50 rounded-full">
              Colorful Collection
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 dark:from-pink-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-6">
              {store.name}
            </h1>
            <p className="text-xl md:text-2xl text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed mb-8">
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
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 dark:from-pink-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-4">
            Vibrant Collection
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            {products.length} colorful items available
          </p>
        </div>
        <ProductGrid products={products} badges={dictionary.badges} locale={locale} />
      </section>
    </div>
  );
}
