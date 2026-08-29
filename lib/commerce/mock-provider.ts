import type {
  Cart,
  CartLine,
  Category,
  CategoryId,
  CollectionId,
  CommerceProvider,
  Money,
  Product,
  PromoSlide,
  Store,
} from "./types";

const categories: Category[] = [
  { id: "fashion", label: "Fashion" },
  { id: "technology", label: "Technology" },
  { id: "home", label: "Home" },
  { id: "beauty", label: "Beauty" },
  { id: "lifestyle", label: "Lifestyle" },
];

const categoryLabels: Record<CategoryId, string> = {
  fashion: "Fashion",
  technology: "Technology",
  home: "Home",
  beauty: "Beauty",
  lifestyle: "Lifestyle",
};

const stores: Store[] = [
  {
    id: "str_aurora",
    slug: "aurora-atelier",
    name: "Aurora Atelier",
    tagline: "Hand-finished lighting for quiet rooms",
    description:
      "A small studio shaping brass and opal glass into lamps that behave like daylight.",
    category: "home",
    categoryLabel: categoryLabels.home,
    location: "Lisbon, PT",
    productCount: 24,
    featured: true,
    cover: {
      gradient: "from-amber-300 via-rose-400 to-fuchsia-600",
      alt: "Aurora Atelier storefront",
    },
    theme: {
      gradient: "from-amber-300 via-rose-400 to-fuchsia-600",
      pattern: "rings",
      accentText: "text-amber-200",
    },
  },
  {
    id: "str_northbound",
    slug: "northbound-supply",
    name: "Northbound Supply",
    tagline: "Gear built for long, cold distances",
    description:
      "Technical outerwear and packs tested above the tree line before anything ships.",
    category: "fashion",
    categoryLabel: categoryLabels.fashion,
    location: "Tromsø, NO",
    productCount: 41,
    featured: true,
    cover: {
      gradient: "from-sky-300 via-cyan-500 to-blue-700",
      alt: "Northbound Supply storefront",
    },
    theme: {
      gradient: "from-sky-300 via-cyan-500 to-blue-700",
      pattern: "beams",
      accentText: "text-sky-200",
    },
  },
  {
    id: "str_mono",
    slug: "mono-goods",
    name: "Mono Goods",
    tagline: "One object, done properly",
    description:
      "A rotating single-product shop. Each release stays until the next one is ready.",
    category: "lifestyle",
    categoryLabel: categoryLabels.lifestyle,
    location: "Kyoto, JP",
    productCount: 9,
    featured: true,
    cover: {
      gradient: "from-neutral-200 via-neutral-400 to-neutral-700",
      alt: "Mono Goods storefront",
    },
    theme: {
      gradient: "from-neutral-200 via-neutral-400 to-neutral-700",
      pattern: "grid",
      accentText: "text-neutral-200",
    },
  },
  {
    id: "str_verdant",
    slug: "verdant-lab",
    name: "Verdant Lab",
    tagline: "Skincare with a short ingredient list",
    description:
      "Formulations developed in-house, batched monthly, printed with full disclosure.",
    category: "beauty",
    categoryLabel: categoryLabels.beauty,
    location: "Copenhagen, DK",
    productCount: 17,
    featured: false,
    cover: {
      gradient: "from-emerald-300 via-teal-500 to-emerald-800",
      alt: "Verdant Lab storefront",
    },
    theme: {
      gradient: "from-emerald-300 via-teal-500 to-emerald-800",
      pattern: "rings",
      accentText: "text-emerald-200",
    },
  },
  {
    id: "str_slowpress",
    slug: "slow-press",
    name: "Slow Press",
    tagline: "Risograph prints in tiny runs",
    description:
      "Independent artists, fifty copies at a time, numbered by hand in the studio.",
    category: "lifestyle",
    categoryLabel: categoryLabels.lifestyle,
    location: "Mexico City, MX",
    productCount: 63,
    featured: false,
    cover: {
      gradient: "from-orange-300 via-red-500 to-purple-700",
      alt: "Slow Press storefront",
    },
    theme: {
      gradient: "from-orange-300 via-red-500 to-purple-700",
      pattern: "grid",
      accentText: "text-orange-200",
    },
  },
  {
    id: "str_hallow",
    slug: "hallow-audio",
    name: "Hallow Audio",
    tagline: "Speakers that disappear into the room",
    description:
      "Cabinetry-first audio, assembled from reclaimed hardwood and open-source drivers.",
    category: "technology",
    categoryLabel: categoryLabels.technology,
    location: "Portland, US",
    productCount: 12,
    featured: false,
    cover: {
      gradient: "from-indigo-300 via-violet-500 to-slate-900",
      alt: "Hallow Audio storefront",
    },
    theme: {
      gradient: "from-indigo-300 via-violet-500 to-slate-900",
      pattern: "beams",
      accentText: "text-indigo-200",
    },
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
    category: "home",
    price: usd(28900),
    image: { gradient: "from-amber-200 to-rose-500", alt: "Opal table lamp" },
    badge: "featured",
    collections: ["featured", "trending"],
    tags: ["lighting", "brass"],
  },
  {
    id: "prd_halo_sconce",
    slug: "halo-wall-sconce",
    storeId: "str_aurora",
    storeName: "Aurora Atelier",
    name: "Halo Wall Sconce",
    description: "A thin brass ring that throws light up the wall and nowhere else.",
    category: "home",
    price: usd(19500),
    image: { gradient: "from-rose-200 to-fuchsia-600", alt: "Halo wall sconce" },
    collections: ["new-arrivals"],
    badge: "new",
    tags: ["lighting"],
  },
  {
    id: "prd_ridge_shell",
    slug: "ridge-shell-jacket",
    storeId: "str_northbound",
    storeName: "Northbound Supply",
    name: "Ridge Shell Jacket",
    description: "Three-layer waterproof shell with taped seams and a helmet-ready hood.",
    category: "fashion",
    price: usd(42000),
    image: { gradient: "from-sky-200 to-blue-700", alt: "Ridge shell jacket" },
    badge: "trending",
    collections: ["trending", "featured"],
    tags: ["outerwear", "waterproof"],
  },
  {
    id: "prd_fjord_pack",
    slug: "fjord-40l-pack",
    storeId: "str_northbound",
    storeName: "Northbound Supply",
    name: "Fjord 40L Pack",
    description: "Roll-top hauler in recycled sailcloth, balanced for long approaches.",
    category: "fashion",
    price: usd(23500),
    image: { gradient: "from-cyan-200 to-blue-800", alt: "Fjord 40 litre pack" },
    collections: ["trending"],
    tags: ["packs"],
  },
  {
    id: "prd_thermal_layer",
    slug: "thermal-base-layer",
    storeId: "str_northbound",
    storeName: "Northbound Supply",
    name: "Thermal Base Layer",
    description: "Merino blend knitted in one piece, so there is nothing to chafe.",
    category: "fashion",
    price: usd(11800),
    image: { gradient: "from-slate-200 to-sky-700", alt: "Thermal base layer" },
    badge: "new",
    collections: ["new-arrivals"],
    tags: ["layers", "merino"],
  },
  {
    id: "prd_edition_07",
    slug: "edition-07-carafe",
    storeId: "str_mono",
    storeName: "Mono Goods",
    name: "Edition 07 Carafe",
    description: "Borosilicate carafe with a cork stopper. Current and only release.",
    category: "home",
    price: usd(7400),
    image: { gradient: "from-neutral-100 to-neutral-600", alt: "Edition 07 carafe" },
    badge: "featured",
    collections: ["featured"],
    tags: ["kitchen", "limited"],
  },
  {
    id: "prd_desk_tray",
    slug: "folded-desk-tray",
    storeId: "str_mono",
    storeName: "Mono Goods",
    name: "Folded Desk Tray",
    description: "A single sheet of anodised aluminium, folded four times. Nothing else.",
    category: "lifestyle",
    price: usd(6200),
    image: { gradient: "from-zinc-200 to-zinc-700", alt: "Folded desk tray" },
    collections: ["trending"],
    tags: ["desk"],
  },
  {
    id: "prd_barrier_serum",
    slug: "barrier-serum",
    storeId: "str_verdant",
    storeName: "Verdant Lab",
    name: "Barrier Serum",
    description: "Six ingredients, batched monthly, dated on the base of every bottle.",
    category: "beauty",
    price: usd(5200),
    image: { gradient: "from-emerald-200 to-teal-700", alt: "Barrier serum bottle" },
    badge: "trending",
    collections: ["trending", "featured"],
    tags: ["skincare"],
  },
  {
    id: "prd_clay_cleanser",
    slug: "green-clay-cleanser",
    storeId: "str_verdant",
    storeName: "Verdant Lab",
    name: "Green Clay Cleanser",
    description: "A gentle clay wash that does not strip the skin it is cleaning.",
    category: "beauty",
    price: usd(3400),
    image: { gradient: "from-lime-200 to-emerald-700", alt: "Green clay cleanser" },
    collections: ["new-arrivals"],
    badge: "new",
    tags: ["skincare"],
  },
  {
    id: "prd_night_balm",
    slug: "night-repair-balm",
    storeId: "str_verdant",
    storeName: "Verdant Lab",
    name: "Night Repair Balm",
    description: "Thick overnight balm in a refillable glass jar, unscented by design.",
    category: "beauty",
    price: usd(4800),
    image: { gradient: "from-teal-200 to-emerald-900", alt: "Night repair balm" },
    collections: ["featured"],
    tags: ["skincare"],
  },
  {
    id: "prd_riso_set",
    slug: "riso-print-set",
    storeId: "str_slowpress",
    storeName: "Slow Press",
    name: "Riso Print Set",
    description: "Three A3 risograph prints, hand-numbered from a run of fifty.",
    category: "lifestyle",
    price: usd(9800),
    image: { gradient: "from-orange-200 to-purple-700", alt: "Risograph print set" },
    badge: "featured",
    collections: ["featured", "trending"],
    tags: ["print", "limited"],
  },
  {
    id: "prd_zine_annual",
    slug: "annual-zine-no-4",
    storeId: "str_slowpress",
    storeName: "Slow Press",
    name: "Annual Zine No. 4",
    description: "Ninety pages of new work from twelve studios, saddle-stitched by hand.",
    category: "lifestyle",
    price: usd(2600),
    image: { gradient: "from-red-200 to-purple-800", alt: "Annual zine number four" },
    badge: "new",
    collections: ["new-arrivals"],
    tags: ["print"],
  },
  {
    id: "prd_alcove_speaker",
    slug: "alcove-bookshelf-speaker",
    storeId: "str_hallow",
    storeName: "Hallow Audio",
    name: "Alcove Bookshelf Speaker",
    description: "Reclaimed ash cabinet, paper cone driver, sold as a matched pair.",
    category: "technology",
    price: usd(64000),
    image: { gradient: "from-indigo-200 to-slate-800", alt: "Alcove bookshelf speaker" },
    badge: "featured",
    collections: ["featured", "trending"],
    tags: ["audio", "pair"],
  },
  {
    id: "prd_field_amp",
    slug: "field-amplifier",
    storeId: "str_hallow",
    storeName: "Hallow Audio",
    name: "Field Amplifier",
    description: "A twelve-watt desk amp with one knob and a very short signal path.",
    category: "technology",
    price: usd(38000),
    image: { gradient: "from-violet-200 to-slate-900", alt: "Field amplifier" },
    collections: ["trending"],
    tags: ["audio"],
  },
  {
    id: "prd_thread_turntable",
    slug: "thread-turntable",
    storeId: "str_hallow",
    storeName: "Hallow Audio",
    name: "Thread Turntable",
    description: "Belt-driven deck with a machined platter and no unnecessary lights.",
    category: "technology",
    price: usd(89000),
    image: { gradient: "from-slate-200 to-indigo-900", alt: "Thread turntable" },
    badge: "new",
    collections: ["new-arrivals", "featured"],
    tags: ["audio"],
  },
  {
    id: "prd_linen_throw",
    slug: "washed-linen-throw",
    storeId: "str_aurora",
    storeName: "Aurora Atelier",
    name: "Washed Linen Throw",
    description: "Heavyweight linen, stonewashed twice, finished with a hand-rolled hem.",
    category: "home",
    price: usd(14500),
    image: { gradient: "from-amber-100 to-rose-400", alt: "Washed linen throw" },
    collections: ["trending"],
    tags: ["textiles"],
  },
  {
    id: "prd_wool_overshirt",
    slug: "wool-overshirt",
    storeId: "str_northbound",
    storeName: "Northbound Supply",
    name: "Wool Overshirt",
    description: "Boiled wool that shrugs off drizzle and reads as a shirt indoors.",
    category: "fashion",
    price: usd(19800),
    image: { gradient: "from-blue-200 to-slate-700", alt: "Wool overshirt" },
    badge: "featured",
    collections: ["featured"],
    tags: ["outerwear"],
  },
  {
    id: "prd_travel_kit",
    slug: "everyday-travel-kit",
    storeId: "str_mono",
    storeName: "Mono Goods",
    name: "Everyday Travel Kit",
    description: "A waxed canvas roll sized for exactly what a week away needs.",
    category: "lifestyle",
    price: usd(8900),
    image: { gradient: "from-stone-200 to-neutral-700", alt: "Everyday travel kit" },
    collections: ["new-arrivals"],
    badge: "new",
    tags: ["travel"],
  },
];

const promoSlides: PromoSlide[] = [
  {
    id: "promo_worlds",
    kicker: "Marketplace",
    title: "Every brand has a world",
    description:
      "Step into storefronts designed by the makers themselves — then take something home.",
    ctaLabel: "Start exploring",
    ctaHref: "/explore",
    theme: {
      gradient: "from-violet-500/40 via-fuchsia-500/25 to-transparent",
      glow: "bg-violet-500/35",
      accentText: "text-violet-200",
    },
    ambient: "aurora",
  },
  {
    id: "promo_northbound",
    kicker: "Vendor spotlight · Northbound Supply",
    title: "Built for the long, cold way round",
    description:
      "The winter range is live: three-layer shells, merino layers and roll-top packs.",
    ctaLabel: "Enter the store",
    ctaHref: "/stores/northbound-supply",
    theme: {
      gradient: "from-sky-400/40 via-cyan-500/25 to-transparent",
      glow: "bg-sky-500/35",
      accentText: "text-sky-200",
    },
    ambient: "beams",
  },
  {
    id: "promo_verdant",
    kicker: "Promotion · Beauty",
    title: "Short ingredient lists, long-standing results",
    description:
      "Verdant Lab batches monthly and dates every bottle. This month's batch is open.",
    ctaLabel: "Shop beauty",
    ctaHref: "/explore",
    theme: {
      gradient: "from-emerald-400/40 via-teal-500/25 to-transparent",
      glow: "bg-emerald-500/35",
      accentText: "text-emerald-200",
    },
    ambient: "orbs",
  },
];

const cartLines: CartLine[] = [
  { id: "line_1", product: products[0], quantity: 1 },
  { id: "line_2", product: products[5], quantity: 2 },
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
 * In-memory provider used while no commerce backend is connected. All reads
 * resolve immediately; nothing is persisted and nothing leaves the process.
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
  async getProductsByCategory(category: CategoryId) {
    return products.filter((product) => product.category === category);
  },
  async getCategories() {
    return categories;
  },
  async getCollection(collection: CollectionId) {
    return products.filter((product) =>
      product.collections.includes(collection),
    );
  },
  async getPromoSlides() {
    return promoSlides;
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
