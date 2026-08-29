import { ArrowUpRight, MapPin } from "lucide-react";
import type { Store } from "@/lib/commerce/types";
import { Badge } from "@/components/ui/badge";

export function StoreCard({ store }: { store: Store }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-surface transition-colors hover:border-white/25">
      <div
        role="img"
        aria-label={store.cover.alt}
        className={`relative h-44 bg-gradient-to-br ${store.cover.gradient}`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
        <span className="absolute top-4 left-4">
          <Badge className="bg-black/40 backdrop-blur">{store.category}</Badge>
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold tracking-tight">{store.name}</h3>
          <ArrowUpRight
            className="size-4 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
            aria-hidden
          />
        </div>
        <p className="mt-2 text-sm text-muted">{store.tagline}</p>
        <p className="mt-4 text-sm leading-relaxed text-muted/80">
          {store.description}
        </p>

        <dl className="mt-6 flex items-center gap-5 border-t border-white/5 pt-5 text-xs text-muted">
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3.5" aria-hidden />
            <dt className="sr-only">Location</dt>
            <dd>{store.location}</dd>
          </div>
          <div>
            <dt className="sr-only">Products</dt>
            <dd>{store.productCount} products</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
