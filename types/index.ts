import type { LucideIcon } from "lucide-react";

/**
 * Route strings used across the app. Keeping them in one union keeps
 * navigation and CTAs free of broken links.
 */
export type Route =
  | "/"
  | "/explore"
  | "/cart"
  | "/seller"
  | "/about"
  | `/stores/${string}`;

export type NavLink = {
  href: Route;
  /** Key into the navigation section of the dictionary. */
  labelKey: NavLabelKey;
};

export type NavLabelKey =
  | "explore"
  | "stores"
  | "openStore"
  | "about"
  | "cart";

export type FooterNavGroup = {
  /** Key into the footer section of the dictionary. */
  titleKey: "marketplace" | "sellers";
  links: NavLink[];
};

export type DiscoveryCategory = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
};

export type SellerBenefit = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};
