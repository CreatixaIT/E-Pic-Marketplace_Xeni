import type { CartState } from "./types";

const CART_STORAGE_KEY = "epic_cart";

export function loadCartFromStorage(): CartState {
  if (typeof window === "undefined") {
    return { items: [], storeId: null, storeName: null };
  }

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) {
      return { items: [], storeId: null, storeName: null };
    }
    return JSON.parse(stored) as CartState;
  } catch (error) {
    console.error("Failed to load cart from storage:", error);
    return { items: [], storeId: null, storeName: null };
  }
}

export function saveCartToStorage(cart: CartState): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart to storage:", error);
  }
}

export function clearCartFromStorage(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear cart from storage:", error);
  }
}