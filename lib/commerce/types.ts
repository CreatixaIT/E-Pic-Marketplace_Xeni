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

export type Store = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  location: string;
  productCount: number;
  featured: boolean;
  cover: Image;
};

export type Product = {
  id: string;
  slug: string;
  storeId: string;
  storeName: string;
  name: string;
  description: string;
  price: Money;
  image: Image;
  tags: string[];
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
  getCart(): Promise<Cart>;
}
