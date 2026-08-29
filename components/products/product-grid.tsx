import type { Product } from "@/lib/commerce/types";
import { Reveal } from "@/components/ui/reveal";
import { ProductCard } from "@/components/products/product-card";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <li key={product.id}>
          <Reveal delay={index * 0.05} className="h-full">
            <ProductCard product={product} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
