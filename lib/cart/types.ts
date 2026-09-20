import type { Product } from "@/lib/commerce/types";

/**
 * Local shopping cart types.
 * 
 * These are separate from CommerceProvider types because:
 * - CommerceProvider = catalogue/product data (read-only from backend)
 * - Cart state = temporary customer shopping session (client-side state)
 */

export type CartItem = {
  cartItemId: string; // Xeni cart item ID for updates/removal
  productId: string;
  product: Product;
  quantity: number;
  storeId: string;
  storeName: string;
};

export type CartState = {
  items: CartItem[];
  storeId: string | null; // null = empty cart, string = single store constraint
  storeName: string | null;
};

export type CartContextType = {
  items: CartItem[];
  storeId: string | null;
  storeName: string | null;
  itemCount: number;
  subtotal: number;
  currency: string; // Derived from cart items, future-ready for multi-currency
  addItem: (product: Product, quantity: number) => Promise<boolean>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  isCrossStoreCheckout: (product: Product) => boolean;
  // Express checkout: persist non-sensitive preferences locally
  getSavedCustomerPreferences: () => { fullName?: string; email?: string; phone?: string } | null;
  saveCustomerPreferences: (preferences: { fullName: string; email: string; phone: string }) => void;
};