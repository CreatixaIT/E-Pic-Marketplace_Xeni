import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { footerNav, siteConfig } from "@/config/site";
import type { Dictionary } from "@/lib/i18n/types";

export function SiteFooter({
  nav,
  footer,
}: {
  nav: Dictionary["nav"];
  footer: Dictionary["footer"];
}) {
  return (
    <footer className="mt-auto border-t border-border py-14">
      <Container>
        <div className="flex flex-col gap-12 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <Logo label={nav.home} />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {siteConfig.tagline}
            </p>
          </div>

          <div className="flex gap-12 sm:gap-20">
            {footerNav.map((group) => (
              <div key={group.titleKey}>
                <h2 className="text-xs font-semibold tracking-[0.2em] text-foreground uppercase">
                  {footer[group.titleKey]}
                </h2>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.labelKey}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted transition-colors hover:text-foreground"
                      >
                        {nav[link.labelKey]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-12 border-t border-border pt-6 text-xs text-muted">
          © {new Date().getFullYear()} {siteConfig.name}. {footer.note}
        </p>
      </Container>
    </footer>
  );
}
