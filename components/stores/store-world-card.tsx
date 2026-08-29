import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Store, StoreTheme } from "@/lib/commerce/types";
import { cn } from "@/lib/utils";

const patterns: Record<StoreTheme["pattern"], string> = {
  grid: "bg-[linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:28px_28px]",
  rings:
    "bg-[repeating-radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.14)_0px,rgba(255,255,255,0.14)_1px,transparent_1px,transparent_26px)]",
  beams:
    "bg-[repeating-linear-gradient(120deg,rgba(255,255,255,0.12)_0px,rgba(255,255,255,0.12)_1px,transparent_1px,transparent_20px)]",
};

/**
 * A store rendered as its own destination: the visual treatment comes entirely
 * from the store's theme data, so no per-store code is needed.
 */
export function StoreWorldCard({
  store,
  enterLabel,
  productsLabel,
}: {
  store: Store;
  enterLabel: string;
  productsLabel: string;
}) {
  return (
    <article className="group relative h-full overflow-hidden rounded-3xl border border-border">
      <div
        aria-hidden
        className={`absolute inset-0 bg-gradient-to-br ${store.theme.gradient} opacity-90 transition-transform duration-700 group-hover:scale-105`}
      />
      <div aria-hidden className={cn("absolute inset-0", patterns[store.theme.pattern])} />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10"
      />

      <div className="relative flex h-full min-h-72 flex-col justify-end p-7">
        <p className={cn("text-xs font-semibold tracking-[0.2em] uppercase", store.theme.accentText)}>
          {store.categoryLabel}
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
          {store.name}
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/80">
          {store.tagline}
        </p>
        <p className="mt-4 text-xs text-white/60">
          {store.productCount} {productsLabel} · {store.location}
        </p>

        <Link
          href={`/stores/${store.slug}`}
          className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {enterLabel}
          <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
