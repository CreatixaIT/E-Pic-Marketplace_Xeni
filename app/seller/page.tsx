import type { Metadata } from "next";
import { BadgeCheck, LayoutTemplate, LineChart, Wallet } from "lucide-react";
import type { SellerBenefit } from "@/types";
import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Section, SectionHeading } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Become a seller",
  description:
    "Open a branded storefront on E-pic. Seller onboarding arrives with Xeni.",
};

const benefits: SellerBenefit[] = [
  {
    id: "storefront",
    title: "A storefront, not a listing",
    description:
      "Your own layout, palette and pacing. Buyers arrive in your world, not a shared template.",
    icon: LayoutTemplate,
  },
  {
    id: "payouts",
    title: "Payouts you can read",
    description:
      "Clear settlement and fees. Handled by the commerce system once connected.",
    icon: Wallet,
  },
  {
    id: "insight",
    title: "Insight that fits a studio",
    description:
      "The handful of numbers a small team actually acts on, not a dashboard maze.",
    icon: LineChart,
  },
  {
    id: "trust",
    title: "Curated by default",
    description:
      "Every brand is reviewed before launch, so the marketplace stays worth browsing.",
    icon: BadgeCheck,
  },
];

const steps = [
  {
    title: "Apply",
    description: "Tell us about the brand, the catalogue and how you make it.",
  },
  {
    title: "Design your world",
    description: "Pick a storefront direction and shape it to the brand.",
  },
  {
    title: "Open the doors",
    description: "Publish, drop your first release, and start selling.",
  },
];

export default function SellerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Sell on E-pic"
        title="Bring your brand. Keep your world."
        description="E-pic hosts storefronts that look like the brands behind them. Applications open when seller onboarding connects — this page is the front door."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/explore" size="lg">
            See existing storefronts
          </ButtonLink>
          <ButtonLink href="/about" size="lg" variant="secondary">
            Read about E-pic
          </ButtonLink>
        </div>
      </PageHeader>

      <Section>
        <SectionHeading
          eyebrow="Why E-pic"
          title="Built for brands that care how they're seen"
        />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2">
          {benefits.map((benefit, index) => (
            <li key={benefit.id}>
              <Reveal delay={index * 0.06} className="h-full">
                <div className="h-full rounded-2xl border border-white/10 bg-surface p-6">
                  <benefit.icon className="size-5 text-accent" aria-hidden />
                  <h3 className="mt-4 text-base font-medium">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {benefit.description}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="border-t border-white/5 bg-surface/40">
        <SectionHeading
          eyebrow="How it works"
          title="Three steps from application to first sale"
        />
        <ol className="mt-12 grid gap-6 sm:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title}>
              <Reveal delay={index * 0.08} className="h-full">
                <div className="h-full rounded-2xl border border-white/10 bg-background/60 p-6">
                  <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                    Step {index + 1}
                  </span>
                  <h3 className="mt-3 text-lg font-medium">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <p className="mt-10 rounded-2xl border border-white/10 bg-background/60 p-5 text-sm leading-relaxed text-muted">
          Seller onboarding, verification and payouts will be handled by the
          commerce system. No application form is collected in this preview.
        </p>
      </Section>
    </>
  );
}
