import { ArrowRight } from "lucide-react";
import { StoreWorldCard } from "@/components/stores/store-world-card";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import type { Store } from "@/lib/commerce/types";
import type { Dictionary } from "@/lib/i18n/types";

export function StoreWorlds({
  stores,
  copy,
}: {
  stores: Store[];
  copy: Dictionary["worlds"];
}) {
  return (
    <Section className="border-t border-border">
      <SectionHeading
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        action={
          <ButtonLink href="/explore" variant="secondary">
            {copy.viewAllStores}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </ButtonLink>
        }
      />

      <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stores.map((store, index) => (
          <li key={store.id}>
            <Reveal delay={index * 0.06} className="h-full">
              <StoreWorldCard
                store={store}
                enterLabel={copy.enterStore}
                productsLabel={copy.products}
              />
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
