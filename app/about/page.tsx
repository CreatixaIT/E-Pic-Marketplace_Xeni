import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description: siteConfig.description,
};

const principles = [
  {
    title: "The brand owns the room",
    body: "A marketplace shouldn't flatten everyone into the same card. Each store controls its own presentation, and E-pic stays out of the way.",
  },
  {
    title: "Discovery over search alone",
    body: "People find things they didn't know to look for by wandering. Collections, drops and one-of-one listings are first-class, not filters.",
  },
  {
    title: "Commerce is a seam, not a spine",
    body: "The storefront layer talks to one provider interface. Swapping the data source behind it never touches a component.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A marketplace of worlds, not listings"
        description={siteConfig.description}
      />

      <Section>
        <SectionHeading
          eyebrow="Principles"
          title="What we're optimising for"
          description="Three ideas shape every decision in the product, down to the folder structure."
        />
        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {principles.map((principle, index) => (
            <li key={principle.title}>
              <Reveal delay={index * 0.07} className="h-full">
                <article className="h-full rounded-2xl border border-border bg-surface p-7">
                  <h3 className="text-lg font-medium">{principle.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {principle.body}
                  </p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="border-t border-border bg-surface/40">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="Status"
            title="Where the product is today"
            description="This is the first milestone: the storefront foundation. Inventory, seller management and payments will be powered by a separate commerce system, and nothing here talks to an external backend yet."
          />
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <ButtonLink href="/explore" size="lg">
              Explore stores
            </ButtonLink>
            <ButtonLink href="/seller" size="lg" variant="secondary">
              Open Your Store
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
