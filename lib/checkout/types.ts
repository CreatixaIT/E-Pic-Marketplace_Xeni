/**
 * Checkout flow types.
 * 
 * These are separate from CommerceProvider and Cart types because:
 * - CommerceProvider = catalogue/product data (read-only from backend)
 * - Cart = temporary shopping items (client-side state)
 * - Checkout = customer and delivery selections (session state)
 * 
 * Future Order System/Xeni = real orders and fulfillment (backend)
 */

export type CustomerDetails = {
  fullName: string;
  phone: string;
  email: string;
};

export type AddressLabel = "home" | "office" | "other";

export type DeliveryAddress = {
  recipientName: string;
  phone: string;
  country: string;
  city: string;
  addressLine: string;
  apartmentDetails?: string;
  deliveryInstructions?: string;
  label?: AddressLabel;
  // Optional GPS coordinates for future delivery pin
  coordinates?: {
    latitude: number;
    longitude: number;
  };
};

export type PaymentMethod = "card" | "mobile-wallet" | "cash-on-delivery";

export type PaymentMethodOption = {
  id: PaymentMethod;
  label: string;
  description: string;
  available: boolean;
  icon?: string;
};

export type CheckoutStep = 
  | "customer-details"
  | "delivery-address"
  | "payment-method"
  | "order-review"
  | "confirmation";

export type CheckoutState = {
  step: CheckoutStep;
  customerDetails: CustomerDetails | null;
  deliveryAddress: DeliveryAddress | null;
  paymentMethod: PaymentMethod | null;
  isComplete: boolean;
};

export type CheckoutContextType = {
  step: CheckoutStep;
  customerDetails: CustomerDetails | null;
  deliveryAddress: DeliveryAddress | null;
  paymentMethod: PaymentMethod | null;
  isComplete: boolean;
  setStep: (step: CheckoutStep) => void;
  setCustomerDetails: (details: CustomerDetails) => void;
  setDeliveryAddress: (address: DeliveryAddress) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setIsComplete: (complete: boolean) => void;
  resetCheckout: () => void;
  advanceToNextStep: () => void;
  canAdvanceToStep: (step: CheckoutStep) => boolean;
};
