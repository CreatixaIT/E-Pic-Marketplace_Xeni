"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { AmbientBackdrop } from "@/components/immersive/ambient-backdrop";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const stats = [
  { label: "Independent stores", value: "180+" },
  { label: "Countries shipping", value: "34" },
  { label: "Curated drops weekly", value: "12" },
];

export function Hero() {
  const reduced = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="relative isolate overflow-hidden pt-24 pb-24 sm:pt-32 sm:pb-32">
      <AmbientBackdrop />

      <Container className="relative">
        <motion.div {...rise(0)}>
          <Badge>
            <Sparkles className="size-3.5 text-accent" aria-hidden />
            Marketplace preview
          </Badge>
        </motion.div>

        <motion.h1
          {...rise(0.08)}
          className="mt-7 max-w-4xl text-5xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl"
        >
          Discover brands.{" "}
          <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-sky-300 bg-clip-text text-transparent">
            Enter their worlds.
          </span>{" "}
          Shop differently.
        </motion.h1>

        <motion.p
          {...rise(0.16)}
          className="mt-7 max-w-xl text-lg leading-relaxed text-muted"
        >
          E-pic gives every brand its own storefront experience — not another
          row in a grid. Walk into the world a maker built, then take something
          home.
        </motion.p>

        <motion.div {...rise(0.24)} className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/explore" size="lg">
            Explore stores
            <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
          <ButtonLink href="/seller" size="lg" variant="secondary">
            Become a seller
          </ButtonLink>
        </motion.div>

        <motion.dl
          {...rise(0.32)}
          className="mt-16 grid max-w-2xl grid-cols-2 gap-8 border-t border-white/5 pt-8 sm:grid-cols-3"
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="text-xs tracking-wide text-muted uppercase">
                {stat.label}
              </dt>
              <dd className="mt-2 text-2xl font-semibold">{stat.value}</dd>
            </div>
          ))}
        </motion.dl>
      </Container>
    </section>
  );
}
