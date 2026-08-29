import type { Product } from "@/lib/commerce/types";
import { formatMoney } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface transition-colors hover:border-white/25">
      <div
        role="img"
        aria-label={product.image.alt}
        className={`h-40 bg-gradient-to-br ${product.image.gradient} transition-transform duration-500 group-hover:scale-[1.03]`}
      />
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs tracking-wide text-muted uppercase">
          {product.storeName}
        </p>
        <h3 className="mt-2 text-base font-medium">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">
          {product.description}
        </p>
        <p className="mt-4 text-sm font-semibold">
          {formatMoney(product.price)}
        </p>
      </div>
    </article>
  );
}
