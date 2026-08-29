import type { ActiveLocale } from "@/config/i18n";
import type { Product } from "@/lib/commerce/types";
import type { Dictionary } from "@/lib/i18n/types";
import { Reveal } from "@/components/ui/reveal";
import { ProductCard } from "@/components/products/product-card";

export function ProductGrid({
  products,
  badges,
  locale,
  columns = 3,
}: {
  products: Product[];
  badges: Dictionary["badges"];
  locale: ActiveLocale;
  columns?: 3 | 4;
}) {
  return (
    <ul
      className={
        columns === 4
          ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          : "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      }
    >
      {products.map((product, index) => (
        <li key={product.id}>
          <Reveal delay={Math.min(index, 6) * 0.05} className="h-full">
            <ProductCard
              product={product}
              locale={locale}
              badgeLabel={product.badge ? badges[product.badge] : undefined}
            />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
