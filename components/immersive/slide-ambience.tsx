import type { PromoSlide } from "@/lib/commerce/types";
import { cn } from "@/lib/utils";

const motifs: Record<PromoSlide["ambient"], string> = {
  aurora:
    "bg-[radial-gradient(60%_50%_at_20%_0%,rgba(255,255,255,0.14),transparent_70%)]",
  beams:
    "bg-[repeating-linear-gradient(115deg,rgba(255,255,255,0.07)_0px,rgba(255,255,255,0.07)_1px,transparent_1px,transparent_22px)]",
  orbs: "bg-[radial-gradient(35%_45%_at_75%_30%,rgba(255,255,255,0.16),transparent_65%)]",
};

/**
 * Per-slide lighting: a tinted wash, a soft glow and a motif layer. Gradients
 * and blur only — no canvas or WebGL.
 */
export function SlideAmbience({
  slide,
  className,
}: {
  slide: PromoSlide;
  className?: string;
}) {
  return (
    <div aria-hidden className={cn("absolute inset-0 overflow-hidden", className)}>
      <div
        className={`absolute inset-0 bg-gradient-to-br ${slide.theme.gradient}`}
      />
      <div
        className={`absolute -top-24 start-1/4 size-[28rem] rounded-full blur-[120px] ${slide.theme.glow}`}
      />
      <div className={`absolute inset-0 ${motifs[slide.ambient]}`} />
    </div>
  );
}
