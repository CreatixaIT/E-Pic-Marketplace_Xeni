import { ArrowRight } from "lucide-react";
import type { Store } from "@/lib/commerce/types";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { StoreGrid } from "@/components/stores/store-grid";

export function FeaturedStores({ stores }: { stores: Store[] }) {
  return (
    <Section>
      <SectionHeading
        eyebrow="Featured worlds"
        title="Storefronts worth stepping into"
        description="Three brands currently running their own experience on E-pic. Each one controls its look, its pace, and how its catalogue is revealed."
        action={
          <ButtonLink href="/explore" variant="secondary">
            View all stores
            <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
        }
      />
      <div className="mt-12">
        <StoreGrid stores={stores} />
      </div>
    </Section>
  );
}
