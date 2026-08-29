import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden border-b border-white/5">
      <div
        aria-hidden
        className="absolute inset-x-0 -top-40 h-80 bg-[radial-gradient(ellipse_at_center,var(--color-accent)/18%,transparent_65%)]"
      />
      <Container className="relative py-16 sm:py-20">
        <Badge>{eyebrow}</Badge>
        <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          {description}
        </p>
        {children ? <div className="mt-8">{children}</div> : null}
      </Container>
    </div>
  );
}
