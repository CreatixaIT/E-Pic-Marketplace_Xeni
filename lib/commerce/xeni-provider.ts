import type {
  Cart,
  CartLine,
  Category,
  CategoryId,
  CheckoutRequest,
  CollectionId,
  CommerceProvider,
  Money,
  Order,
  Product,
  PromoSlide,
  Store,
} from "./types";

// Xeni API Configuration - Separated by endpoint type
const XENI_PUBLIC_API_BASE_URL = process.env.XENI_PUBLIC_API_BASE_URL || "http://localhost:8080/api/public/v1";
const XENI_API_BASE_URL = process.env.XENI_API_BASE_URL || "http://localhost:8080/api";
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
  shop_slug?: string;
  shop_name: string;
  shop_description?: string;
  shop_logo_url?: string;
  district?: string;
  preferred_language?: string;
  store_theme: string;
};

type XeniStoreDetail = {
  store: XeniStore;
  products: XeniProduct[];
  product_count: number;
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
  // 1 BDT = 100 paisa
  return {
    amount: Math.round(price * 100),
    currency: "BDT",
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

  // Use shop_slug if available, otherwise use ID
  const slug = xeniStore.shop_slug || xeniStore.id;

  // Map Xeni theme to E-Pic visual template
  const themeTemplate = xeniStore.store_theme === "luxury" ? "luxury" 
                       : xeniStore.store_theme === "colorful" ? "colorful" 
                       : "minimal";

  return {
    id: xeniStore.id,
    slug: slug,
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
      template: themeTemplate,
      hero: {
        title: xeniStore.shop_name,
        description: xeniStore.shop_description,
      },
      brandStory: {
        title: `About ${xeniStore.shop_name}`,
        content: xeniStore.shop_description || "",
      },
      visual: {
        ambientMotion: xeniStore.store_theme === "luxury" || xeniStore.store_theme === "colorful",
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

// Helper: Fetch from Xeni Public API with error handling
async function fetchFromXeniPublic<T>(endpoint: string): Promise<T> {
  try {
    const url = `${XENI_PUBLIC_API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Xeni Public API error: ${response.status} ${response.statusText}`);
    }

    const result: XeniApiResponse<T> = await response.json();

    if (!result.success) {
      throw new Error(`Xeni Public API error: ${result.error || "Unknown error"}`);
    }

    return result.data;
  } catch (error) {
    console.error(`Error fetching from Xeni Public API (${endpoint}):`, error);
    throw error;
  }
}

// Helper: Fetch from Xeni Buyer API with error handling
async function fetchFromXeniBuyer<T>(endpoint: string): Promise<T> {
  try {
    const url = `${XENI_API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Xeni Buyer API error: ${response.status} ${response.statusText}`);
    }

    const result: XeniApiResponse<T> = await response.json();

    if (!result.success) {
      throw new Error(`Xeni Buyer API error: ${result.error || "Unknown error"}`);
    }

    return result.data;
  } catch (error) {
    console.error(`Error fetching from Xeni Buyer API (${endpoint}):`, error);
    throw error;
  }
}

// Helper: Create empty cart
// Helper: Map Xeni cart to E-Pic cart
function mapXeniCartToEpic(xeniCart: any): Cart {
  if (!xeniCart || !xeniCart.cart_items) {
    return createEmptyCart();
  }

  const lines: CartLine[] = xeniCart.cart_items.map((item: any) => {
    const product = item.product;
    const variant = item.variant;
    
    // Calculate price (use variant price if available, otherwise product price)
    const basePrice = product?.price || 0;
    const priceModifier = variant?.price_modifier || 0;
    const finalPrice = basePrice + priceModifier;
    
    // Build product object
    const epicProduct: Product = {
      id: product?.id || item.product_id,
      slug: product?.id || item.product_id, // Use ID as slug for now
      storeId: product?.store?.id || "",
      storeName: product?.store?.shop_name || "Unknown Store",
      name: product?.name || "Unknown Product",
      nameBn: product?.name_bn,
      description: product?.description || "",
      category: "lifestyle",
      categoryLabel: "Lifestyle",
      price: xeniPriceToMoney(finalPrice),
      originalPrice: xeniPriceToMoney(basePrice),
      availability: product?.is_out_of_stock ? "out-of-stock" : "in-stock",
      image: {
        gradient: "from-neutral-200 to-neutral-400",
        alt: product?.name || "Product image",
        url: product?.images?.[0] || undefined,
      },
      images: (product?.images || []).map((img: string) => ({
        gradient: "from-neutral-200 to-neutral-400",
        alt: product?.name || "Product image",
        url: img,
      })),
      collections: [], // Xeni doesn't have collections, use empty array
      tags: [], // Xeni doesn't have tags, use empty array
      variant: variant ? {
        id: variant.id,
        sku: variant.sku,
        color: variant.color,
        size: variant.size,
        priceModifier: variant.price_modifier,
        stock: variant.stock,
        active: variant.is_active,
      } : undefined,
    };

    return {
      id: item.id,
      product: epicProduct,
      quantity: item.quantity,
      lineTotal: xeniPriceToMoney(finalPrice * item.quantity),
    };
  });

  // Calculate subtotal
  const subtotal = lines.reduce((total, line) => total + line.lineTotal.amount, 0);

  return {
    id: xeniCart.id,
    lines,
    subtotal: { amount: subtotal, currency: "BDT" },
    currency: "BDT",
  };
}

function createEmptyCart(): Cart {
  return {
    id: "cart-empty",
    lines: [],
    subtotal: { amount: 0, currency: "BDT" },
    currency: "BDT",
  };
}

// Helper: Get session ID from localStorage for guest carts
function getSessionId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("epic_session_id");
  } catch {
    return null;
  }
}

// Helper: Generate and store session ID for guest carts
function ensureSessionId(): string {
  if (typeof window === "undefined") return "";
  let sessionId = localStorage.getItem("epic_session_id");
  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem("epic_session_id", sessionId);
  }
  return sessionId;
}

// Helper: Map Xeni cart item to E-Pic cart line
function mapXeniCartItemToEpic(xeniItem: { id: string; quantity: number; product?: { price: number }; price?: number }, product: Product): CartLine {
  return {
    id: xeniItem.id,
    product,
    quantity: xeniItem.quantity,
    lineTotal: xeniPriceToMoney((xeniItem.product?.price || xeniItem.price || 0) * xeniItem.quantity),
  };
}

// Helper: Map Xeni order to E-Pic order
function mapXeniOrderToEpic(xeniOrder: {
  id: string;
  shop_id: string;
  shop_name?: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  order_items?: Array<{
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
  }>;
  subtotal?: number;
  delivery_charge?: number;
  total_amount?: number;
  payment_method: string;
  payment_status: string;
  delivery_status: string;
  created_at: string;
}): Order {
  return {
    id: xeniOrder.id,
    storeId: xeniOrder.shop_id,
    storeName: xeniOrder.shop_name || "Unknown Store",
    customerName: xeniOrder.customer_name,
    customerPhone: xeniOrder.customer_phone,
    customerAddress: xeniOrder.customer_address,
    items: xeniOrder.order_items?.map((item) => ({
      productId: item.product_id,
      productName: item.product_name,
      quantity: item.quantity,
      price: xeniPriceToMoney(item.price),
      lineTotal: xeniPriceToMoney(item.price * item.quantity),
    })) || [],
    subtotal: xeniPriceToMoney(xeniOrder.subtotal || 0),
    deliveryCharge: xeniPriceToMoney(xeniOrder.delivery_charge || 0),
    total: xeniPriceToMoney(xeniOrder.total_amount || 0),
    paymentMethod: xeniOrder.payment_method,
    paymentStatus: xeniOrder.payment_status,
    deliveryStatus: xeniOrder.delivery_status,
    createdAt: xeniOrder.created_at,
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
      const response = await fetchFromXeniPublic<{ data: XeniStore[]; meta: { page: number; per_page: number; total: number; total_pages: number } }>("/stores?per_page=100");
      const stores = response.data || [];
      return stores.map(store => mapXeniStoreToEpic(store));
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
      const xeniStoreDetail = await fetchFromXeniPublic<XeniStoreDetail>(`/stores/${slug}`);
      return mapXeniStoreToEpic(xeniStoreDetail.store, xeniStoreDetail.product_count);
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
      const response = await fetchFromXeniPublic<XeniProduct[]>("/products?per_page=100");
      const products = response || [];
      return products.map(mapXeniProductToEpic);
    } catch {
      console.error("Failed to fetch products from Xeni, returning empty array");
      return [];
    }
  },

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const response = await fetchFromXeniPublic<XeniProduct[]>("/products/featured?per_page=12");
      const products = response || [];
      return products.map(mapXeniProductToEpic);
    } catch {
      console.error("Failed to fetch featured products from Xeni, returning empty array");
      return [];
    }
  },

  async getBestSellingProducts(): Promise<Product[]> {
    try {
      const response = await fetchFromXeniPublic<XeniProduct[]>("/products/bestselling?per_page=12");
      const products = response || [];
      return products.map(mapXeniProductToEpic);
    } catch {
      console.error("Failed to fetch best-selling products from Xeni, returning empty array");
      return [];
    }
  },

  async getNewProducts(): Promise<Product[]> {
    try {
      const response = await fetchFromXeniPublic<XeniProduct[]>("/products/new?per_page=12");
      const products = response || [];
      return products.map(mapXeniProductToEpic);
    } catch {
      console.error("Failed to fetch new products from Xeni, returning empty array");
      return [];
    }
  },

  async getProductsByStore(storeId: string): Promise<Product[]> {
    try {
      const response = await fetchFromXeniPublic<XeniProduct[]>(`/products?store_id=${storeId}&per_page=100`);
      const products = response || [];
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
      const response = await fetchFromXeniPublic<XeniProduct[]>(`/products?category=${slug}&per_page=100`);
      const products = response || [];
      return products.map(mapXeniProductToEpic);
    } catch {
      console.error(`Failed to fetch products for category ${category} from Xeni, returning empty array`);
      return [];
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const xeniCategories = await fetchFromXeniPublic<XeniCategory[]>("/categories");
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
    // Fetch cart from server-side API route which calls Xeni
    const sessionId = getSessionId();
    const url = sessionId ? `/api/cart?session_id=${sessionId}` : `/api/cart`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error("Failed to fetch cart:", response.status);
        return createEmptyCart();
      }
      
      const data = await response.json();
      // Map Xeni cart response to E-Pic cart format
      return mapXeniCartToEpic(data);
    } catch (error) {
      console.error("Cart fetch error:", error);
      return createEmptyCart();
    }
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const xeniProduct = await fetchFromXeniPublic<XeniProduct>(`/products/${slug}`);
      return mapXeniProductToEpic(xeniProduct);
    } catch {
      console.error(`Failed to fetch product ${slug} from Xeni`);
      return null;
    }
  },

  async addToCart(productId: string, quantity: number, variantId?: string): Promise<Cart> {
    // Uses server-side API route
    const sessionId = ensureSessionId();
    const body: any = { product_id: productId, quantity };
    if (variantId) {
      body.variant_id = variantId;
    }
    
    const response = await fetch(`/api/cart/items?session_id=${sessionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error("Failed to add to cart");
    
    const data = await response.json();
    // Map Xeni cart response to E-Pic cart
    return mapXeniCartToEpic(data);
  },

  async updateCartItem(itemId: string, quantity: number): Promise<Cart> {
    const sessionId = getSessionId();
    const url = sessionId ? `/api/cart/items/${itemId}?session_id=${sessionId}` : `/api/cart/items/${itemId}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) throw new Error("Failed to update cart item");
    
    const data = await response.json();
    return mapXeniCartToEpic(data);
  },

  async removeFromCart(itemId: string): Promise<Cart> {
    const sessionId = getSessionId();
    const url = sessionId ? `/api/cart/items/${itemId}?session_id=${sessionId}` : `/api/cart/items/${itemId}`;
    const response = await fetch(url, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to remove cart item");
    
    const data = await response.json();
    return mapXeniCartToEpic(data);
  },

  async clearCart(): Promise<void> {
    const sessionId = getSessionId();
    const url = sessionId ? `/api/cart/clear?session_id=${sessionId}` : `/api/cart/clear`;
    await fetch(url, { method: "POST" });
  },

  async checkout(request: CheckoutRequest): Promise<Order[]> {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error("Checkout failed");
    const data = await response.json();
    // Xeni returns array of orders (one per shop for multi-store checkout)
    return Array.isArray(data) ? data.map(mapXeniOrderToEpic) : [mapXeniOrderToEpic(data)];
  },

  async getOrders(): Promise<Order[]> {
    const response = await fetch("/api/orders");
    if (!response.ok) throw new Error("Failed to fetch orders");
    const data = await response.json();
    return (data.orders || data || []).map(mapXeniOrderToEpic);
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    const response = await fetch(`/api/orders/${orderId}`);
    if (!response.ok) return null;
    const data = await response.json();
    return mapXeniOrderToEpic(data);
  },
};
