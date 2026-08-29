import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getCommerceProvider } from "@/lib/commerce";
import { getPreferences } from "@/lib/preferences/server";
import { siteConfig } from "@/config/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [cart, { theme, locale, dir, dictionary }] = await Promise.all([
    getCommerceProvider().getCart(),
    getPreferences(),
  ]);
  const cartCount = cart.lines.reduce((total, line) => total + line.quantity, 0);

  return (
    <html
      lang={locale}
      dir={dir}
      data-theme={theme}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader
          cartCount={cartCount}
          nav={dictionary.nav}
          preferences={dictionary.preferences}
          theme={theme}
          locale={locale}
        />
        <main className="flex-1">{children}</main>
        <SiteFooter nav={dictionary.nav} footer={dictionary.footer} />
      </body>
    </html>
  );
}
