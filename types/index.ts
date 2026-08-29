import type { LucideIcon } from "lucide-react";

export type NavLink = {
  label: string;
  href: Route;
};

/**
 * Route strings used across the app. Keeping them in one union keeps
 * navigation and CTAs free of broken links.
 */
export type Route = "/" | "/explore" | "/cart" | "/seller" | "/about";

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
