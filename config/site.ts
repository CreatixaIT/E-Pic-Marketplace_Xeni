import type { FooterNavGroup, NavLink } from "@/types";

export const siteConfig = {
  name: "E-pic",
  tagline: "Discover brands. Enter their worlds. Shop differently.",
  description:
    "E-pic is a premium marketplace where every brand gets its own immersive storefront. Discover independent makers, step inside their worlds, and shop differently.",
  url: "https://epic.example.com",
} as const;

export const mainNav: NavLink[] = [
  { labelKey: "explore", href: "/explore" },
  { labelKey: "stores", href: "/explore" },
  { labelKey: "openStore", href: "/seller" },
  { labelKey: "about", href: "/about" },
];

export const footerNav: FooterNavGroup[] = [
  {
    titleKey: "marketplace",
    links: [
      { labelKey: "explore", href: "/explore" },
      { labelKey: "stores", href: "/explore" },
      { labelKey: "cart", href: "/cart" },
    ],
  },
  {
    titleKey: "sellers",
    links: [
      { labelKey: "openStore", href: "/seller" },
      { labelKey: "about", href: "/about" },
    ],
  },
];
