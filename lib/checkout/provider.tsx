"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type {
  CheckoutContextType,
  CheckoutState,
  CustomerDetails,
  DeliveryAddress,
  PaymentMethod,
  CheckoutStep,
} from "./types";

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

const initialState: CheckoutState = {
  step: "customer-details",
  customerDetails: null,
  deliveryAddress: null,
  paymentMethod: null,
  isComplete: false,
};

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [checkout, setCheckout] = useState<CheckoutState>(initialState);

  const setStep = (step: CheckoutStep) => {
    setCheckout((prev) => ({ ...prev, step }));
  };

  const setCustomerDetails = (details: CustomerDetails) => {
    setCheckout((prev) => ({ ...prev, customerDetails: details }));
  };

  const setDeliveryAddress = (address: DeliveryAddress) => {
    setCheckout((prev) => ({ ...prev, deliveryAddress: address }));
  };

  const setPaymentMethod = (method: PaymentMethod) => {
    setCheckout((prev) => ({ ...prev, paymentMethod: method }));
  };

  const setIsComplete = (complete: boolean) => {
    setCheckout((prev) => ({ ...prev, isComplete: complete }));
  };

  const resetCheckout = () => {
    setCheckout(initialState);
  };

  const canAdvanceToStep = (step: CheckoutStep): boolean => {
    switch (step) {
      case "customer-details":
        return true;
      case "delivery-address":
        return checkout.customerDetails !== null;
      case "payment-method":
        return checkout.customerDetails !== null && checkout.deliveryAddress !== null;
      case "order-review":
        return (
          checkout.customerDetails !== null &&
          checkout.deliveryAddress !== null &&
          checkout.paymentMethod !== null
        );
      case "confirmation":
        return checkout.isComplete;
      default:
        return false;
    }
  };

  const advanceToNextStep = () => {
    const steps: CheckoutStep[] = [
      "customer-details",
      "delivery-address",
      "payment-method",
      "order-review",
      "confirmation",
    ];

    const currentIndex = steps.indexOf(checkout.step);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      if (canAdvanceToStep(nextStep)) {
        setStep(nextStep);
      }
    }
  };

  return (
    <CheckoutContext.Provider
      value={{
        step: checkout.step,
        customerDetails: checkout.customerDetails,
        deliveryAddress: checkout.deliveryAddress,
        paymentMethod: checkout.paymentMethod,
        isComplete: checkout.isComplete,
        setStep,
        setCustomerDetails,
        setDeliveryAddress,
        setPaymentMethod,
        setIsComplete,
        resetCheckout,
        advanceToNextStep,
        canAdvanceToStep,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout(): CheckoutContextType {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
}
