import type {
  Cart,
  Category,
  CategoryId,
  CollectionId,
  CommerceProvider,
  Money,
  Product,
  PromoSlide,
  Store,
} from "./types";

// Xeni API Configuration
const XENI_API_BASE_URL = process.env.XENI_API_BASE_URL || "http://localhost:8080/api/public/v1";
const LOW_STOCK_THRESHOLD = 10;

// Xeni API Response Types
type XeniApiResponse<T> = {
  success: boolean;
  data: T;
  meta?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
  error?: string;
};

type XeniProduct = {
  id: string;
  name: string;
  name_bn?: string;
  description: string;
  description_bn?: string;
  price: number;
  sku: string;
  current_stock: number;
  is_out_of_stock: boolean;
  is_active: boolean;
  images: string[];
  variants: Array<{
    id: string;
    sku: string;
    color?: string;
    size?: string;
    price_modifier: number;
    stock: number;
    is_active: boolean;
  }>;
  store: {
    id: string;
    shop_name: string;
    shop_description?: string;
    shop_logo_url?: string;
    district?: string;
    preferred_language?: string;
  };
  category: {
    id: string;
    slug: string;
    name: string;
    name_bn?: string;
  };
  categories: Array<{
    id: string;
    slug: string;
    name: string;
    name_bn?: string;
  }>;
  created_at: string;
  updated_at: string;
};

type XeniStore = {
  id: string;
  shop_name: string;
  shop_description?: string;
  shop_logo_url?: string;
  district?: string;
  preferred_language?: string;
};

type XeniCategory = {
  id: string;
  slug: string;
  name: string;
  name_bn?: string;
  parent_id: string | null;
  is_active: boolean;
  description?: string;
  display_order: number;
  children: XeniCategory[];
};

// Helper: Convert Xeni price to E-Pic Money format
function xeniPriceToMoney(price: number): Money {
  // Xeni stores prices as decimal (BDT), convert to minor units (paisa)
  // For now, we'll treat as USD cents for compatibility
  // TODO: Add proper currency conversion in future milestone
  return {
    amount: Math.round(price * 100),
    currency: "USD",
  };
}

// Helper: Map Xeni availability to E-Pic availability
function xeniAvailabilityToEpic(stock: number, outOfStock: boolean): Product["availability"] {
  if (outOfStock || stock <= 0) return "out-of-stock";
  if (stock <= LOW_STOCK_THRESHOLD) return "low-stock";
  return "in-stock";
}

// Helper: Map Xeni category slug to E-Pic CategoryId
function xeniCategoryToEpic(slug: string): CategoryId {
  const mapping: Record<string, CategoryId> = {
    fashion: "fashion",
    technology: "technology",
    home: "home",
    beauty: "beauty",
    lifestyle: "lifestyle",
  };
  return mapping[slug] || "lifestyle"; // Default fallback
}

// Helper: Generate gradient from Xeni store data
function generateGradientForStore(storeName: string): string {
  const gradients = [
    "from-amber-300 via-rose-400 to-fuchsia-600",
    "from-sky-300 via-cyan-500 to-blue-700",
    "from-emerald-300 via-teal-500 to-emerald-800",
    "from-neutral-200 via-neutral-400 to-neutral-700",
    "from-orange-300 via-red-500 to-purple-700",
    "from-indigo-300 via-violet-500 to-slate-900",
  ];
  const index = storeName.charCodeAt(0) % gradients.length;
  return gradients[index];
}

// Helper: Generate pattern for store
function generatePatternForStore(storeName: string): Store["theme"]["pattern"] {
  const patterns: Array<"grid" | "rings" | "beams"> = ["grid", "rings", "beams"];
  const index = storeName.charCodeAt(1) % patterns.length;
  return patterns[index];
}

// Helper: Generate gradient for product
function generateGradientForProduct(productName: string): string {
  const gradients = [
    "from-amber-200 to-rose-500",
    "from-rose-200 to-fuchsia-600",
    "from-sky-200 to-blue-700",
    "from-cyan-200 to-blue-800",
    "from-slate-200 to-sky-700",
    "from-neutral-100 to-neutral-600",
    "from-zinc-200 to-zinc-700",
    "from-emerald-200 to-teal-700",
    "from-lime-200 to-emerald-700",
    "from-teal-200 to-emerald-900",
    "from-orange-200 to-purple-700",
    "from-red-200 to-purple-800",
    "from-indigo-200 to-slate-800",
    "from-violet-200 to-slate-900",
    "from-slate-200 to-indigo-900",
    "from-amber-100 to-rose-400",
    "from-blue-200 to-slate-700",
    "from-stone-200 to-neutral-700",
  ];
  const index = productName.charCodeAt(0) % gradients.length;
  return gradients[index];
}

// Helper: Map Xeni product to E-Pic product
function mapXeniProductToEpic(xeniProduct: XeniProduct): Product {
  const categoryId = xeniCategoryToEpic(xeniProduct.category.slug);
  const categoryLabels: Record<CategoryId, string> = {
    fashion: "Fashion",
    technology: "Technology",
    home: "Home",
    beauty: "Beauty",
    lifestyle: "Lifestyle",
  };

  return {
    id: xeniProduct.id,
    slug: xeniProduct.id, // Using UUID as slug for now
    storeId: xeniProduct.store.id,
    storeName: xeniProduct.store.shop_name,
    name: xeniProduct.name,
    description: xeniProduct.description,
    category: categoryId,
    categoryLabel: categoryLabels[categoryId],
    price: xeniPriceToMoney(xeniProduct.price),
    image: {
      gradient: generateGradientForProduct(xeniProduct.name),
      alt: xeniProduct.name,
      url: xeniProduct.images[0] || undefined,
    },
    badge: undefined, // Xeni doesn't have badges, could derive from collections later
    collections: [], // Xeni doesn't have collections, empty for now
    tags: [xeniProduct.category.slug],
    highlights: xeniProduct.variants.length > 0 
      ? xeniProduct.variants.slice(0, 4).map(v => `${v.color || v.size || 'Variant'}: ${v.sku}`)
      : undefined,
    availability: xeniAvailabilityToEpic(xeniProduct.current_stock, xeniProduct.is_out_of_stock),
  };
}

// Helper: Map Xeni store to E-Pic store
function mapXeniStoreToEpic(xeniStore: XeniStore, productCount: number = 0): Store {
  const categoryId = "lifestyle"; // Default, will update when we have category data
  const categoryLabels: Record<CategoryId, string> = {
    fashion: "Fashion",
    technology: "Technology",
    home: "Home",
    beauty: "Beauty",
    lifestyle: "Lifestyle",
  };

  const gradient = generateGradientForStore(xeniStore.shop_name);
  const pattern = generatePatternForStore(xeniStore.shop_name);

  return {
    id: xeniStore.id,
    slug: xeniStore.id, // Using UUID as slug for now
    name: xeniStore.shop_name,
    tagline: xeniStore.shop_description || "",
    description: xeniStore.shop_description || "",
    category: categoryId,
    categoryLabel: categoryLabels[categoryId],
    location: xeniStore.district || "Unknown",
    productCount,
    featured: false, // Xeni doesn't have featured flag
    cover: {
      gradient,
      alt: `${xeniStore.shop_name} storefront`,
      url: xeniStore.shop_logo_url || undefined,
    },
    theme: {
      gradient,
      pattern,
      accentText: "text-foreground",
    },
    visualConfig: {
      template: "minimal",
      hero: {
        title: xeniStore.shop_name,
        description: xeniStore.shop_description,
      },
      brandStory: {
        title: `About ${xeniStore.shop_name}`,
        content: xeniStore.shop_description || "",
      },
      visual: {
        ambientMotion: false,
        density: "comfortable",
      },
    },
  };
}

// Helper: Map Xeni category to E-Pic category
function mapXeniCategoryToEpic(xeniCategory: XeniCategory): Category {
  const epicId = xeniCategoryToEpic(xeniCategory.slug);
  return {
    id: epicId,
    label: xeniCategory.name,
  };
}

// Helper: Fetch from Xeni API with error handling
async function fetchFromXeni<T>(endpoint: string): Promise<T> {
  try {
    const url = `${XENI_API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Xeni API error: ${response.status} ${response.statusText}`);
    }

    const result: XeniApiResponse<T> = await response.json();

    if (!result.success) {
      throw new Error(`Xeni API error: ${result.error || "Unknown error"}`);
    }

    return result.data;
  } catch (error) {
    console.error(`Error fetching from Xeni API (${endpoint}):`, error);
    throw error;
  }
}

// Helper: Create empty cart
function createEmptyCart(): Cart {
  return {
    id: "cart-empty",
    lines: [],
    subtotal: { amount: 0, currency: "USD" },
    currency: "USD",
  };
}

// Helper: Create mock promo slides (Xeni doesn't have this feature)
function createMockPromoSlides(): PromoSlide[] {
  return [
    {
      id: "promo_xeni_1",
      kicker: "Marketplace",
      title: "Discover Xeni Products",
      description: "Explore products from our integrated commerce partners.",
      ctaLabel: "Start shopping",
      ctaHref: "/explore",
      theme: {
        gradient: "from-blue-500 via-purple-500 to-pink-500",
        glow: "from-blue-400/20 to-purple-400/20",
        accentText: "text-blue-200",
      },
      ambient: "aurora",
    },
  ];
}

export const xeniProvider: CommerceProvider = {
  name: "xeni",

  async getStores(): Promise<Store[]> {
    try {
      const xeniStores = await fetchFromXeni<XeniStore[]>("/stores");
      return xeniStores.map(store => mapXeniStoreToEpic(store));
    } catch {
      console.error("Failed to fetch stores from Xeni, returning empty array");
      return [];
    }
  },

  async getFeaturedStores(): Promise<Store[]> {
    // Xeni doesn't have featured flag, return first few stores
    try {
      const stores = await this.getStores();
      return stores.slice(0, 3);
    } catch {
      console.error("Failed to fetch featured stores from Xeni, returning empty array");
      return [];
    }
  },

  async getStoreBySlug(slug: string): Promise<Store | null> {
    try {
      const xeniStore = await fetchFromXeni<XeniStore>(`/stores/${slug}`);
      return mapXeniStoreToEpic(xeniStore);
    } catch {
      console.error(`Failed to fetch store ${slug} from Xeni`);
      return null;
    }
  },

  async getStoreById(storeId: string): Promise<Store | null> {
    return this.getStoreBySlug(storeId); // Xeni uses UUID for both
  },

  async getProducts(): Promise<Product[]> {
    try {
      const response = await fetchFromXeni<{ data: XeniProduct[]; meta: { page: number; per_page: number; total: number; total_pages: number } }>("/products?per_page=100");
      const products = response.data || [];
      return products.map(mapXeniProductToEpic);
    } catch {
      console.error("Failed to fetch products from Xeni, returning empty array");
      return [];
    }
  },

  async getProductsByStore(storeId: string): Promise<Product[]> {
    try {
      const response = await fetchFromXeni<{ data: XeniProduct[]; meta: { page: number; per_page: number; total: number; total_pages: number } }>(`/products?store_id=${storeId}&per_page=100`);
      const products = response.data || [];
      return products.map(mapXeniProductToEpic);
    } catch {
      console.error(`Failed to fetch products for store ${storeId} from Xeni, returning empty array`);
      return [];
    }
  },

  async getProductsByCategory(category: CategoryId): Promise<Product[]> {
    try {
      // Map E-Pic category to Xeni slug
      const categoryToSlug: Record<CategoryId, string> = {
        fashion: "fashion",
        technology: "technology",
        home: "home",
        beauty: "beauty",
        lifestyle: "lifestyle",
      };
      const slug = categoryToSlug[category];
      const response = await fetchFromXeni<{ data: XeniProduct[]; meta: { page: number; per_page: number; total: number; total_pages: number } }>(`/products?category=${slug}&per_page=100`);
      const products = response.data || [];
      return products.map(mapXeniProductToEpic);
    } catch {
      console.error(`Failed to fetch products for category ${category} from Xeni, returning empty array`);
      return [];
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const xeniCategories = await fetchFromXeni<XeniCategory[]>("/categories");
      // Flatten hierarchy and map to E-Pic categories
      const flatCategories: XeniCategory[] = [];
      
      function flatten(categories: XeniCategory[]) {
        for (const cat of categories) {
          flatCategories.push(cat);
          if (cat.children && cat.children.length > 0) {
            flatten(cat.children);
          }
        }
      }
      
      flatten(xeniCategories);
      
      // Get unique categories by ID
      const uniqueCategories = Array.from(
        new Map(flatCategories.map(cat => [cat.id, cat])).values()
      );
      
      return uniqueCategories.map(mapXeniCategoryToEpic);
    } catch {
      console.error("Failed to fetch categories from Xeni, returning default categories");
      // Return default E-Pic categories as fallback
      return [
        { id: "fashion", label: "Fashion" },
        { id: "technology", label: "Technology" },
        { id: "home", label: "Home" },
        { id: "beauty", label: "Beauty" },
        { id: "lifestyle", label: "Lifestyle" },
      ];
    }
  },

  async getCollection(collection: CollectionId): Promise<Product[]> {
    // Xeni doesn't have collections, return all products filtered by different criteria
    try {
      const allProducts = await this.getProducts();
      
      switch (collection) {
        case "trending":
          // Sort by creation date (newest first) for trending
          return [...allProducts].slice(0, 8);
        case "featured":
          // Return first 8 products as featured
          return allProducts.slice(0, 8);
        case "new-arrivals":
          // Return last 8 products as new arrivals
          return [...allProducts].slice(-8);
        default:
          return [];
      }
    } catch {
      console.error(`Failed to fetch collection ${collection} from Xeni, returning empty array`);
      return [];
    }
  },

  async getPromoSlides(): Promise<PromoSlide[]> {
    // Xeni doesn't have promo slides, return mock
    return createMockPromoSlides();
  },

  async getCart(): Promise<Cart> {
    // Cart functionality not implemented in this milestone
    return createEmptyCart();
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const xeniProduct = await fetchFromXeni<XeniProduct>(`/products/${slug}`);
      return mapXeniProductToEpic(xeniProduct);
    } catch {
      console.error(`Failed to fetch product ${slug} from Xeni`);
      return null;
    }
  },
};
