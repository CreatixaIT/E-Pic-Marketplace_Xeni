import Link from "next/link";
import type { Store } from "@/lib/commerce/types";
import { Reveal } from "@/components/ui/reveal";
import { StoreCard } from "@/components/stores/store-card";

export function StoreGrid({ stores }: { stores: Store[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {stores.map((store, index) => (
        <li key={store.id}>
          <Reveal delay={index * 0.06} className="h-full">
            <Link
              href={`/stores/${store.slug}`}
              className="block h-full rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <StoreCard store={store} />
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
