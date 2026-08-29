import { Compass, Gem, Layers, Radio } from "lucide-react";
import type { DiscoveryCategory } from "@/types";
import type { Store } from "@/lib/commerce/types";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { StorefrontStage } from "@/components/immersive/storefront-stage";

const categories: DiscoveryCategory[] = [
  {
    id: "worlds",
    title: "Branded worlds",
    description:
      "Enter a storefront designed by the brand itself — typography, pace and all.",
    icon: Compass,
    accent: "text-violet-300",
  },
  {
    id: "drops",
    title: "Live drops",
    description:
      "Limited releases that open and close on the maker's schedule, not ours.",
    icon: Radio,
    accent: "text-fuchsia-300",
  },
  {
    id: "collections",
    title: "Curated collections",
    description:
      "Cross-store edits assembled around a material, a season or an idea.",
    icon: Layers,
    accent: "text-sky-300",
  },
  {
    id: "rare",
    title: "One-of-one",
    description:
      "Single-piece listings from studios that only ever make one of a thing.",
    icon: Gem,
    accent: "text-emerald-300",
  },
];

export function DiscoverySection({ stores }: { stores: Store[] }) {
  return (
    <Section className="border-y border-white/5 bg-surface/40">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Discovery"
            title="Four ways into the marketplace"
            description="Discovery on E-pic is built around how brands actually sell, rather than a single infinite product feed."
          />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            {categories.map((category, index) => (
              <li key={category.id}>
                <Reveal delay={index * 0.06}>
                  <div className="h-full rounded-2xl border border-white/10 bg-background/60 p-5 transition-colors hover:border-white/25">
                    <category.icon
                      className={`size-5 ${category.accent}`}
                      aria-hidden
                    />
                    <h3 className="mt-4 text-base font-medium">
                      {category.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {category.description}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <StorefrontStage stores={stores} />
      </div>
    </Section>
  );
}
