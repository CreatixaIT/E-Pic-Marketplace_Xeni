import type {
  Cart,
  CartLine,
  CommerceProvider,
  Money,
  Product,
  Store,
} from "./types";

const stores: Store[] = [
  {
    id: "str_aurora",
    slug: "aurora-atelier",
    name: "Aurora Atelier",
    tagline: "Hand-finished lighting for quiet rooms",
    description:
      "A small studio shaping brass and opal glass into lamps that behave like daylight.",
    category: "Home & Light",
    location: "Lisbon, PT",
    productCount: 24,
    featured: true,
    cover: { gradient: "from-amber-300 via-rose-400 to-fuchsia-600", alt: "Aurora Atelier storefront" },
  },
  {
    id: "str_northbound",
    slug: "northbound-supply",
    name: "Northbound Supply",
    tagline: "Gear built for long, cold distances",
    description:
      "Technical outerwear and packs tested above the tree line before anything ships.",
    category: "Outdoor",
    location: "Tromsø, NO",
    productCount: 41,
    featured: true,
    cover: { gradient: "from-sky-300 via-cyan-500 to-blue-700", alt: "Northbound Supply storefront" },
  },
  {
    id: "str_mono",
    slug: "mono-goods",
    name: "Mono Goods",
    tagline: "One object, done properly",
    description:
      "A rotating single-product shop. Each release stays until the next one is ready.",
    category: "Design",
    location: "Kyoto, JP",
    productCount: 9,
    featured: true,
    cover: { gradient: "from-neutral-200 via-neutral-400 to-neutral-700", alt: "Mono Goods storefront" },
  },
  {
    id: "str_verdant",
    slug: "verdant-lab",
    name: "Verdant Lab",
    tagline: "Skincare with a short ingredient list",
    description:
      "Formulations developed in-house, batched monthly, printed with full disclosure.",
    category: "Beauty",
    location: "Copenhagen, DK",
    productCount: 17,
    featured: false,
    cover: { gradient: "from-emerald-300 via-teal-500 to-emerald-800", alt: "Verdant Lab storefront" },
  },
  {
    id: "str_slowpress",
    slug: "slow-press",
    name: "Slow Press",
    tagline: "Risograph prints in tiny runs",
    description:
      "Independent artists, fifty copies at a time, numbered by hand in the studio.",
    category: "Art & Print",
    location: "Mexico City, MX",
    productCount: 63,
    featured: false,
    cover: { gradient: "from-orange-300 via-red-500 to-purple-700", alt: "Slow Press storefront" },
  },
  {
    id: "str_hallow",
    slug: "hallow-audio",
    name: "Hallow Audio",
    tagline: "Speakers that disappear into the room",
    description:
      "Cabinetry-first audio, assembled from reclaimed hardwood and open-source drivers.",
    category: "Audio",
    location: "Portland, US",
    productCount: 12,
    featured: false,
    cover: { gradient: "from-indigo-300 via-violet-500 to-slate-900", alt: "Hallow Audio storefront" },
  },
];

const usd = (amount: number): Money => ({ amount, currency: "USD" });

const products: Product[] = [
  {
    id: "prd_opal_lamp",
    slug: "opal-table-lamp",
    storeId: "str_aurora",
    storeName: "Aurora Atelier",
    name: "Opal Table Lamp",
    description: "Blown opal shade on a solid brass stem with a dimmable warm core.",
    price: usd(28900),
    image: { gradient: "from-amber-200 to-rose-500", alt: "Opal table lamp" },
    tags: ["lighting", "brass"],
  },
  {
    id: "prd_ridge_shell",
    slug: "ridge-shell-jacket",
    storeId: "str_northbound",
    storeName: "Northbound Supply",
    name: "Ridge Shell Jacket",
    description: "Three-layer waterproof shell with taped seams and a helmet-ready hood.",
    price: usd(42000),
    image: { gradient: "from-sky-200 to-blue-700", alt: "Ridge shell jacket" },
    tags: ["outerwear", "waterproof"],
  },
  {
    id: "prd_edition_07",
    slug: "edition-07-carafe",
    storeId: "str_mono",
    storeName: "Mono Goods",
    name: "Edition 07 Carafe",
    description: "Borosilicate carafe with a cork stopper. Current and only release.",
    price: usd(7400),
    image: { gradient: "from-neutral-100 to-neutral-600", alt: "Edition 07 carafe" },
    tags: ["kitchen", "limited"],
  },
  {
    id: "prd_barrier_serum",
    slug: "barrier-serum",
    storeId: "str_verdant",
    storeName: "Verdant Lab",
    name: "Barrier Serum",
    description: "Six ingredients, batched monthly, dated on the base of every bottle.",
    price: usd(5200),
    image: { gradient: "from-emerald-200 to-teal-700", alt: "Barrier serum bottle" },
    tags: ["skincare"],
  },
  {
    id: "prd_riso_set",
    slug: "riso-print-set",
    storeId: "str_slowpress",
    storeName: "Slow Press",
    name: "Riso Print Set",
    description: "Three A3 risograph prints, hand-numbered from a run of fifty.",
    price: usd(9800),
    image: { gradient: "from-orange-200 to-purple-700", alt: "Risograph print set" },
    tags: ["print", "limited"],
  },
  {
    id: "prd_alcove_speaker",
    slug: "alcove-bookshelf-speaker",
    storeId: "str_hallow",
    storeName: "Hallow Audio",
    name: "Alcove Bookshelf Speaker",
    description: "Reclaimed ash cabinet, paper cone driver, sold as a matched pair.",
    price: usd(64000),
    image: { gradient: "from-indigo-200 to-slate-800", alt: "Alcove bookshelf speaker" },
    tags: ["audio", "pair"],
  },
];

const cartLines: CartLine[] = [
  { id: "line_1", product: products[0], quantity: 1 },
  { id: "line_2", product: products[2], quantity: 2 },
];

function subtotal(lines: CartLine[]): Money {
  return {
    amount: lines.reduce(
      (total, line) => total + line.product.price.amount * line.quantity,
      0,
    ),
    currency: "USD",
  };
}

/**
 * In-memory provider used for Milestone 1. All reads resolve immediately;
 * nothing is persisted and nothing leaves the process.
 */
export const mockProvider: CommerceProvider = {
  name: "mock",
  async getStores() {
    return stores;
  },
  async getFeaturedStores() {
    return stores.filter((store) => store.featured);
  },
  async getStoreBySlug(slug) {
    return stores.find((store) => store.slug === slug) ?? null;
  },
  async getProducts() {
    return products;
  },
  async getProductsByStore(storeId) {
    return products.filter((product) => product.storeId === storeId);
  },
  async getCart(): Promise<Cart> {
    return {
      id: "cart_mock",
      lines: cartLines,
      subtotal: subtotal(cartLines),
      currency: "USD",
    };
  },
};
