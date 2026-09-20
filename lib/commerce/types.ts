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
  currency: "USD" | "EUR" | "GBP" | "BDT";
};

export type Image = {
  /** Placeholder gradient token until real assets exist. */
  gradient: string;
  alt: string;
  /** Future: real image URL when assets are available */
  url?: string;
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

/** Storefront presentation templates */
export type StoreTemplate = "minimal" | "luxury" | "colorful" | "editorial" | "immersive";

/** Store-specific visual configuration for the chosen template */
export type StoreVisualConfig = {
  template: StoreTemplate;
  /** Hero section content */
  hero: {
    title?: string;
    description?: string;
    ctaLabel?: string;
  };
  /** Brand story section */
  brandStory?: {
    title: string;
    content: string;
  };
  /** Featured collection IDs */
  featuredCollectionIds?: CollectionId[];
  /** Template-specific visual settings */
  visual: {
    /** Whether to show ambient motion effects */
    ambientMotion: boolean;
    /** Layout density */
    density: "compact" | "comfortable" | "spacious";
  };
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
  /** Storefront configuration for template-driven presentation */
  visualConfig: StoreVisualConfig;
};

export type Product = {
  id: string;
  slug: string;
  storeId: string;
  storeName: string;
  name: string;
  nameBn?: string;
  description: string;
  category: CategoryId;
  categoryLabel: string;
  price: Money;
  originalPrice?: Money;
  image: Image;
  images?: Image[]; // Multiple images for gallery
  badge?: ProductBadge;
  collections: CollectionId[];
  tags: string[];
  /** Product highlights/specifications for detail page */
  highlights?: string[];
  /** Availability status */
  availability: "in-stock" | "low-stock" | "out-of-stock";
  /** Variant information if product has variants */
  variant?: {
    id: string;
    sku: string;
    color?: string;
    size?: string;
    priceModifier: number;
    stock: number;
    active: boolean;
  };
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
  lineTotal: Money;
};

export type Cart = {
  id: string;
  lines: CartLine[];
  subtotal: Money;
  currency: Money["currency"];
};

export type Order = {
  id: string;
  storeId: string;
  storeName: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: Money;
    lineTotal: Money;
  }>;
  subtotal: Money;
  deliveryCharge: Money;
  total: Money;
  paymentMethod: string;
  paymentStatus: string;
  deliveryStatus: string;
  createdAt: string;
};

export type CheckoutRequest = {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: string;
  notes?: string;
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
  getStoreById(storeId: string): Promise<Store | null>;
  getProducts(): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getBestSellingProducts(): Promise<Product[]>;
  getNewProducts(): Promise<Product[]>;
  getProductsByStore(storeId: string): Promise<Product[]>;
  getProductsByCategory(category: CategoryId): Promise<Product[]>;
  getCategories(): Promise<Category[]>;
  getCollection(collection: CollectionId): Promise<Product[]>;
  getPromoSlides(): Promise<PromoSlide[]>;
  getCart(): Promise<Cart>;
  getProductBySlug(slug: string): Promise<Product | null>;
  // Cart operations
  addToCart(productId: string, quantity: number): Promise<Cart>;
  updateCartItem(itemId: string, quantity: number): Promise<Cart>;
  removeFromCart(itemId: string): Promise<Cart>;
  clearCart(): Promise<void>;
  // Checkout and orders
  checkout(request: CheckoutRequest): Promise<Order[]>;
  getOrders(): Promise<Order[]>;
  getOrderById(orderId: string): Promise<Order | null>;
  // Cart operations with variant support
  addToCart(productId: string, quantity: number, variantId?: string): Promise<Cart>;
}
