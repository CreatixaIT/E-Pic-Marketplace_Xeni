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



export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>(() => loadCartFromStorage());

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  // Load cart from Xeni on mount
  useEffect(() => {
    const loadXeniCart = async () => {
      try {
        const commerce = await import("@/lib/commerce");
        const provider = commerce.getCommerceProvider();
        const xeniCart = await provider.getCart();
        
        setCart({
          items: xeniCart.lines.map(line => ({
            cartItemId: line.id,
            productId: line.product.id,
            product: line.product,
            quantity: line.quantity,
            storeId: line.product.storeId,
            storeName: line.product.storeName,
          })),
          storeId: xeniCart.lines.length > 0 ? xeniCart.lines[0].product.storeId : null,
          storeName: xeniCart.lines.length > 0 ? xeniCart.lines[0].product.storeName : null,
        });
      } catch (error) {
        console.error("Failed to load cart from Xeni:", error);
        // Keep localStorage cart as fallback
      }
    };
    
    loadXeniCart();
  }, []);

  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
  
  const subtotal = cart.items.reduce(
    (total, item) => total + item.product.price.amount * item.quantity,
    0
  );

  // Derive currency from cart items (all items should have same currency in single-store cart)
  const currency = cart.items.length > 0 ? cart.items[0].product.price.currency : "BDT";

  const addItem = async (product: Product, quantity: number): Promise<boolean> => {
    // Check if this would be a cross-store checkout
    if (cart.storeId && cart.storeId !== product.storeId) {
      return false; // Signal that cross-store checkout was attempted
    }

    // Use commerce provider to add item
    try {
      const commerce = await import("@/lib/commerce");
      const provider = commerce.getCommerceProvider();
      
      // Add variant ID if product has a selected variant
      const variantId = product.variant?.id;
      const updatedCart = await provider.addToCart(product.id, quantity, variantId);
      
      // Update cart state with the returned cart from backend
      setCart({
        items: updatedCart.lines.map(line => ({
          cartItemId: line.id, // Store the cart item ID from Xeni
          productId: line.product.id,
          product: line.product,
          quantity: line.quantity,
          storeId: line.product.storeId,
          storeName: line.product.storeName,
        })),
        storeId: updatedCart.lines.length > 0 ? updatedCart.lines[0].product.storeId : null,
        storeName: updatedCart.lines.length > 0 ? updatedCart.lines[0].product.storeName : null,
      });
      
      return true;
    } catch (error) {
      console.error("Failed to add to cart:", error);
      return false;
    }
  };

  const removeItem = async (productId: string) => {
    try {
      const commerce = await import("@/lib/commerce");
      const provider = commerce.getCommerceProvider();
      
      // Find the cart item for this product to get its Xeni cart item ID
      const cartItem = cart.items.find(item => item.productId === productId);
      if (!cartItem) return;
      
      await provider.removeFromCart(cartItem.cartItemId);
      
      // Refresh cart from backend to get updated state
      const updatedCart = await provider.getCart();
      
      setCart({
        items: updatedCart.lines.map(line => ({
          cartItemId: line.id,
          productId: line.product.id,
          product: line.product,
          quantity: line.quantity,
          storeId: line.product.storeId,
          storeName: line.product.storeName,
        })),
        storeId: updatedCart.lines.length > 0 ? updatedCart.lines[0].product.storeId : null,
        storeName: updatedCart.lines.length > 0 ? updatedCart.lines[0].product.storeName : null,
      });
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }

    try {
      const commerce = await import("@/lib/commerce");
      const provider = commerce.getCommerceProvider();
      
      // Find the cart item for this product to get its Xeni cart item ID
      const cartItem = cart.items.find(item => item.productId === productId);
      if (!cartItem) return;
      
      await provider.updateCartItem(cartItem.cartItemId, quantity);
      
      // Refresh cart from backend to get updated state
      const updatedCart = await provider.getCart();
      
      setCart({
        items: updatedCart.lines.map(line => ({
          cartItemId: line.id,
          productId: line.product.id,
          product: line.product,
          quantity: line.quantity,
          storeId: line.product.storeId,
          storeName: line.product.storeName,
        })),
        storeId: updatedCart.lines.length > 0 ? updatedCart.lines[0].product.storeId : null,
        storeName: updatedCart.lines.length > 0 ? updatedCart.lines[0].product.storeName : null,
      });
    } catch (error) {
      console.error("Failed to update cart quantity:", error);
    }
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