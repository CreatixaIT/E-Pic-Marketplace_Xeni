import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { footerNav, siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/5 py-14">
      <Container>
        <div className="flex flex-col gap-12 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {siteConfig.tagline}
            </p>
          </div>

          <div className="flex gap-12 sm:gap-20">
            {footerNav.map((group) => (
              <div key={group.title}>
                <h2 className="text-xs font-semibold tracking-[0.2em] text-foreground uppercase">
                  {group.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-12 border-t border-white/5 pt-6 text-xs text-muted">
          © {new Date().getFullYear()} {siteConfig.name}. Preview build —
          commerce operations arrive with Xeni.
        </p>
      </Container>
    </footer>
  );
}
