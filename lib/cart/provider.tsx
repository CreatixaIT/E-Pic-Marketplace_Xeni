"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Product } from "@/lib/commerce/types";
import type { CartContextType, CartItem, CartState } from "./types";
import { 
  loadCartFromStorage, 
  saveCartToStorage, 
  clearCartFromStorage,
  loadCustomerPreferences,
  saveCustomerPreferences 
} from "./storage";

const CartContext = createContext<CartContextType | undefined>(undefined);

function getAccessToken(): string {
  const cookies = document.cookie.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  return cookies.gateway_access_token || "";
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>(() => loadCartFromStorage());

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
  
  const subtotal = cart.items.reduce(
    (total, item) => total + item.product.price.amount * item.quantity,
    0
  );

  // Derive currency from cart items (all items should have same currency in single-store cart)
  const currency = cart.items.length > 0 ? cart.items[0].product.price.currency : "USD";

  const addItem = async (product: Product, quantity: number): Promise<boolean> => {
    // Check if this would be a cross-store checkout
    if (cart.storeId && cart.storeId !== product.storeId) {
      return false; // Signal that cross-store checkout was attempted
    }

    // Sync with backend cart
    try {
      const response = await fetch("http://localhost:8080/api/cart/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update local cart with backend response
        // For now, keep local cart for immediate UI updates
      }
    } catch (error) {
      console.error("Failed to sync cart with backend:", error);
    }

    setCart((prev) => {
      const existingItem = prev.items.find((item) => item.productId === product.id);
      
      let newItems: CartItem[];
      if (existingItem) {
        newItems = prev.items.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [
          ...prev.items,
          {
            productId: product.id,
            product,
            quantity,
            storeId: product.storeId,
            storeName: product.storeName,
          },
        ];
      }

      return {
        items: newItems,
        storeId: product.storeId,
        storeName: product.storeName,
      };
    });

    return true;
  };

  const removeItem = (productId: string) => {
    setCart((prev) => {
      const newItems = prev.items.filter((item) => item.productId !== productId);
      
      // If cart is now empty, clear store constraint
      if (newItems.length === 0) {
        return { items: [], storeId: null, storeName: null };
      }

      return {
        ...prev,
        items: newItems,
      };
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setCart((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      ),
    }));
  };

  const clearCart = () => {
    setCart({ items: [], storeId: null, storeName: null });
    clearCartFromStorage();
  };

  const isCrossStoreCheckout = (product: Product): boolean => {
    return cart.storeId !== null && cart.storeId !== product.storeId;
  };

  const getSavedCustomerPreferences = () => {
    return loadCustomerPreferences();
  };

  const saveCustomerPreferencesData = (preferences: { fullName: string; email: string; phone: string }) => {
    saveCustomerPreferences(preferences);
  };

  return (
    <CartContext.Provider
      value={{
        items: cart.items,
        storeId: cart.storeId,
        storeName: cart.storeName,
        itemCount,
        subtotal,
        currency,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCrossStoreCheckout,
        getSavedCustomerPreferences,
        saveCustomerPreferences: saveCustomerPreferencesData,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}