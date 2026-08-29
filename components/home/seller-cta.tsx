import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import type { Dictionary } from "@/lib/i18n/types";

export function SellerCta({ copy }: { copy: Dictionary["seller"] }) {
  return (
    <Section>
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-accent/25 via-accent/10 to-transparent p-10 sm:p-14">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
              {copy.eyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {copy.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              {copy.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/seller" size="lg">
                {copy.cta}
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
              </ButtonLink>
              <ButtonLink href="/about" size="lg" variant="secondary">
                {copy.secondaryCta}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
