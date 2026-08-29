import type { Store } from "@/lib/commerce/types";
import { Reveal } from "@/components/ui/reveal";
import { StoreCard } from "@/components/stores/store-card";

export function StoreGrid({ stores }: { stores: Store[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {stores.map((store, index) => (
        <li key={store.id}>
          <Reveal delay={index * 0.06} className="h-full">
            <StoreCard store={store} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
