"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { AmbientBackdrop } from "@/components/immersive/ambient-backdrop";
import { SlideAmbience } from "@/components/immersive/slide-ambience";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { PromoSlide } from "@/lib/commerce/types";
import { interpolate } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n/types";
import { cn } from "@/lib/utils";

const SLIDE_DURATION_MS = 7000;

/**
 * Promotional slideshow. Depth comes from stacked, differently-parallaxed
 * layers driven by pointer position — CSS transforms only.
 */
export function PromoHero({
  slides,
  copy,
}: {
  slides: PromoSlide[];
  copy: Dictionary["hero"];
}) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const total = slides.length;
  const slide = slides[index];

  const goTo = useCallback(
    (next: number) => setIndex(((next % total) + total) % total),
    [total],
  );

  useEffect(() => {
    if (!playing || reduced || total < 2) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % total),
      SLIDE_DURATION_MS,
    );
    return () => window.clearInterval(timer);
  }, [playing, reduced, total]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    }
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: (event.clientX - bounds.left) / bounds.width - 0.5,
      y: (event.clientY - bounds.top) / bounds.height - 0.5,
    });
  };

  const parallax = (depth: number) =>
    reduced
      ? undefined
      : { x: pointer.x * depth, y: pointer.y * depth * 0.6 };

  if (!slide) return null;

  return (
    <section
      className="relative isolate overflow-hidden pt-14 pb-16 sm:pt-20 sm:pb-20"
      aria-label={copy.badge}
    >
      <AmbientBackdrop />

      <Container className="relative">
        <h1 className="max-w-3xl text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
          {copy.tagline}
        </h1>

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label={copy.badge}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerMove={onPointerMove}
          onPointerLeave={() => setPointer({ x: 0, y: 0 })}
          onMouseEnter={() => setPlaying(false)}
          onMouseLeave={() => setPlaying(true)}
          onFocus={() => setPlaying(false)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setPlaying(true);
            }
          }}
          className="relative mt-8 overflow-hidden rounded-[2rem] border border-border bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <AnimatePresence mode="sync">
            <motion.div
              key={slide.id}
              className="absolute inset-0"
              initial={reduced ? false : { opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <SlideAmbience slide={slide} />
            </motion.div>
          </AnimatePresence>

          <motion.div
            className="relative grid min-h-[24rem] items-end gap-8 p-7 sm:min-h-[28rem] sm:p-12"
            animate={parallax(14)}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          >
            <div
              aria-live="polite"
              aria-atomic
              className="max-w-2xl"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  initial={reduced ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Badge
                    className={cn(
                      "border-white/15 bg-black/45 backdrop-blur",
                      slide.theme.accentText,
                    )}
                  >
                    {slide.kicker}
                  </Badge>
                  <h2 className="mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
                    {slide.title}
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                    {slide.description}
                  </p>
                  <div className="mt-8">
                    <ButtonLink href={slide.ctaHref} size="lg">
                      {slide.ctaLabel}
                      <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
                    </ButtonLink>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <ol className="flex items-center gap-2">
                {slides.map((item, itemIndex) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => goTo(itemIndex)}
                      aria-label={interpolate(copy.goToSlide, {
                        index: itemIndex + 1,
                      })}
                      aria-current={itemIndex === index}
                      className={cn(
                        "h-1.5 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
                        itemIndex === index
                          ? "w-10 bg-foreground"
                          : "w-4 bg-foreground/30 hover:bg-foreground/60",
                      )}
                    />
                  </li>
                ))}
                <li className="ms-2 text-xs text-muted">
                  {interpolate(copy.slideLabel, {
                    current: index + 1,
                    total,
                  })}
                </li>
              </ol>

              <div className="flex items-center gap-2">
                <HeroControl
                  label={playing ? copy.pause : copy.play}
                  onClick={() => setPlaying((value) => !value)}
                >
                  {playing ? (
                    <Pause className="size-4" aria-hidden />
                  ) : (
                    <Play className="size-4" aria-hidden />
                  )}
                </HeroControl>
                <HeroControl label={copy.previous} onClick={() => goTo(index - 1)}>
                  <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden />
                </HeroControl>
                <HeroControl label={copy.next} onClick={() => goTo(index + 1)}>
                  <ChevronRight className="size-4 rtl:rotate-180" aria-hidden />
                </HeroControl>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function HeroControl({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="rounded-full border border-border bg-background/40 p-2.5 text-muted backdrop-blur transition-colors hover:border-foreground/30 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {children}
    </button>
  );
}
