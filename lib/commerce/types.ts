import type { Route } from "@/types";

/**
 * Provider-agnostic commerce contracts.
 *
 * UI components consume these types only; they never talk to a backend
 * directly. Swapping the mock provider for Xeni (or anything else) is a
 * configuration change, not a component change.
 */

export type Money = {
  /** Minor units, e.g. cents. Avoids float rounding issues. */
  amount: number;
  currency: "USD" | "EUR" | "GBP";
};

export type Image = {
  /** Placeholder gradient token until real assets exist. */
  gradient: string;
  alt: string;
};

/** Marketplace-wide taxonomy. Stores and products both map onto it. */
export type CategoryId =
  | "fashion"
  | "technology"
  | "home"
  | "beauty"
  | "lifestyle";

export type Category = {
  id: CategoryId;
  /** Human label; localisation of taxonomy labels is a later milestone. */
  label: string;
};

/** Editorial groupings the homepage curates products into. */
export type CollectionId = "trending" | "featured" | "new-arrivals";

export type ProductBadge = "new" | "featured" | "trending";

/**
 * Visual treatment a storefront controls. Kept as data so store cards (and
 * later, full store pages) can render distinct worlds without per-store code.
 */
export type StoreTheme = {
  gradient: string;
  /** Backdrop motif rendered behind the card content. */
  pattern: "grid" | "rings" | "beams";
  /** Tailwind text colour token used for the store's accent copy. */
  accentText: string;
};

export type Store = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: CategoryId;
  categoryLabel: string;
  location: string;
  productCount: number;
  featured: boolean;
  cover: Image;
  theme: StoreTheme;
};

export type Product = {
  id: string;
  slug: string;
  storeId: string;
  storeName: string;
  name: string;
  description: string;
  category: CategoryId;
  price: Money;
  image: Image;
  badge?: ProductBadge;
  collections: CollectionId[];
  tags: string[];
};

/** A promotional slide in the homepage hero. Content is mock data. */
export type PromoSlide = {
  id: string;
  /** Promotional category or vendor the slide belongs to. */
  kicker: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: Route;
  theme: {
    gradient: string;
    glow: string;
    accentText: string;
  };
  /** Ambient backdrop motif for the slide. */
  ambient: "aurora" | "beams" | "orbs";
};

export type CartLine = {
  id: string;
  product: Product;
  quantity: number;
};

export type Cart = {
  id: string;
  lines: CartLine[];
  subtotal: Money;
  currency: Money["currency"];
};

/**
 * The single seam between the UI and whichever commerce backend is active.
 * Every method is async so a network-backed implementation is a drop-in.
 */
export interface CommerceProvider {
  readonly name: string;
  getStores(): Promise<Store[]>;
  getFeaturedStores(): Promise<Store[]>;
  getStoreBySlug(slug: string): Promise<Store | null>;
  getProducts(): Promise<Product[]>;
  getProductsByStore(storeId: string): Promise<Product[]>;
  getProductsByCategory(category: CategoryId): Promise<Product[]>;
  getCategories(): Promise<Category[]>;
  getCollection(collection: CollectionId): Promise<Product[]>;
  getPromoSlides(): Promise<PromoSlide[]>;
  getCart(): Promise<Cart>;
}
