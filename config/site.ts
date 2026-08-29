import type { NavLink } from "@/types";

export const siteConfig = {
  name: "E-pic",
  tagline: "Discover brands. Enter their worlds. Shop differently.",
  description:
    "E-pic is a premium marketplace where every brand gets its own immersive storefront. Discover independent makers, step inside their worlds, and shop differently.",
  url: "https://epic.example.com",
} as const;

export const mainNav: NavLink[] = [
  { label: "Explore", href: "/explore" },
  { label: "Stores", href: "/explore" },
  { label: "Become a Seller", href: "/seller" },
  { label: "About", href: "/about" },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Marketplace",
    links: [
      { label: "Explore", href: "/explore" },
      { label: "Stores", href: "/explore" },
      { label: "Cart", href: "/cart" },
    ],
  },
  {
    title: "Sellers",
    links: [
      { label: "Become a Seller", href: "/seller" },
      { label: "About", href: "/about" },
    ],
  },
];
