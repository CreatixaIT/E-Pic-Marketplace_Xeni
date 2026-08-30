"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, X, LogOut, User } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { LanguageSelector } from "@/components/preferences/language-selector";
import { ThemeSelector } from "@/components/preferences/theme-selector";
import { useCart } from "@/lib/cart";
import { useSession, signOut } from "next-auth/react";
import type { ActiveLocale } from "@/config/i18n";
import type { ThemeId } from "@/config/themes";
import { mainNav } from "@/config/site";
import { interpolate } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n/types";
import { cn } from "@/lib/utils";

export function SiteHeader({
  nav,
  preferences,
  theme,
  locale,
}: {
  nav: Dictionary["nav"];
  preferences: Dictionary["preferences"];
  theme: ThemeId;
  locale: ActiveLocale;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <Container>
        <nav
          aria-label="Main"
          className="flex h-16 items-center justify-between gap-6"
        >
          <Logo label={nav.home} />

          <ul className="hidden items-center gap-8 md:flex">
            {mainNav.map((link) => (
              <li key={link.labelKey}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-sm transition-colors hover:text-foreground",
                    pathname === link.href ? "text-foreground" : "text-muted",
                  )}
                >
                  {nav[link.labelKey]}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <LanguageSelector locale={locale} label={preferences.language} />
            <ThemeSelector theme={theme} label={preferences.theme} />

            {/* Auth buttons */}
            {session ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/account"
                  className="hidden md:flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
                >
                  <User className="size-4" />
                  <span>{nav.account || "Account"}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-border p-2.5 text-muted transition-colors hover:border-foreground/30 hover:text-foreground"
                  aria-label="Logout"
                >
                  <LogOut className="size-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium text-accent transition-colors hover:text-accent/80"
                >
                  Sign up
                </Link>
              </div>
            )}

            <Link
              href="/cart"
              aria-label={interpolate(nav.cartLabel, { count: itemCount })}
              className="relative rounded-full border border-border p-2.5 text-muted transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              <ShoppingBag className="size-4" aria-hidden />
              {itemCount > 0 ? (
                <span className="absolute -top-1 -right-1 grid size-4.5 place-items-center rounded-full bg-accent text-[10px] font-semibold text-accent-contrast">
                  {itemCount}
                </span>
              ) : null}
            </Link>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? nav.closeMenu : nav.openMenu}
              className="rounded-full border border-border p-2.5 text-muted transition-colors hover:text-foreground md:hidden"
            >
              {open ? (
                <X className="size-4" aria-hidden />
              ) : (
                <Menu className="size-4" aria-hidden />
              )}
            </button>
          </div>
        </nav>
      </Container>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <Container>
              <ul className="flex flex-col py-3">
                {mainNav.map((link) => (
                  <li key={link.labelKey}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block py-3 text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {nav[link.labelKey]}
                    </Link>
                  </li>
                ))}
                <li className="border-t border-border pt-3 mt-3">
                  {session ? (
                    <div className="space-y-3">
                      <Link
                        href="/account"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 py-3 px-3 text-sm text-muted transition-colors hover:text-foreground"
                      >
                        <User className="size-4" />
                        <span>{nav.account || "Account"}</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setOpen(false);
                        }}
                        className="block w-full text-left py-3 px-3 text-sm text-muted transition-colors hover:text-foreground"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        href="/login"
                        onClick={() => setOpen(false)}
                        className="block py-3 px-3 text-sm text-muted transition-colors hover:text-foreground"
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setOpen(false)}
                        className="block py-3 px-3 text-sm text-accent transition-colors hover:text-accent/80"
                      >
                        Sign up
                      </Link>
                    </div>
                  )}
                </li>
              </ul>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
