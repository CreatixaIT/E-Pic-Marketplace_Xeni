export { CartProvider, useCart } from "./provider";
export type { CartContextType, CartItem, CartState } from "./types";
export { 
  loadCartFromStorage, 
  saveCartToStorage, 
  clearCartFromStorage,
  loadCustomerPreferences,
  saveCustomerPreferences,
  clearCustomerPreferences,
  type CustomerPreferences
} from "./storage";