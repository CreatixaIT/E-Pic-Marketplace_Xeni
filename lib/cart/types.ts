import type { Product } from "@/lib/commerce/types";

/**
 * Local shopping cart types.
 * 
 * These are separate from CommerceProvider types because:
 * - CommerceProvider = catalogue/product data (read-only from backend)
 * - Cart state = temporary customer shopping session (client-side state)
 */

export type CartItem = {
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
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCrossStoreCheckout: (product: Product) => boolean;
};