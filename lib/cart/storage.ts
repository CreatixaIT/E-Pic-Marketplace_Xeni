import type { CartState } from "./types";

const CART_STORAGE_KEY = "epic_cart";
const CUSTOMER_PREFS_KEY = "epic_customer_prefs";

export type CustomerPreferences = {
  fullName: string;
  email: string;
  phone: string;
};

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

export function loadCustomerPreferences(): CustomerPreferences | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = localStorage.getItem(CUSTOMER_PREFS_KEY);
    if (!stored) {
      return null;
    }
    return JSON.parse(stored) as CustomerPreferences;
  } catch (error) {
    console.error("Failed to load customer preferences from storage:", error);
    return null;
  }
}

export function saveCustomerPreferences(prefs: CustomerPreferences): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(CUSTOMER_PREFS_KEY, JSON.stringify(prefs));
  } catch (error) {
    console.error("Failed to save customer preferences to storage:", error);
  }
}

export function clearCustomerPreferences(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(CUSTOMER_PREFS_KEY);
  } catch (error) {
    console.error("Failed to clear customer preferences from storage:", error);
  }
}