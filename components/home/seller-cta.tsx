import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";

export function SellerCta() {
  return (
    <Section>
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600/25 via-fuchsia-600/10 to-transparent p-10 sm:p-14">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
              For sellers
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Bring your brand. Keep your world.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Launch a storefront that looks like you, not like a template.
              Onboarding, catalogue and payouts will run through Xeni once it
              connects — this milestone is the storefront layer.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/seller" size="lg">
                Become a seller
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href="/about" size="lg" variant="secondary">
                How E-pic works
              </ButtonLink>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
