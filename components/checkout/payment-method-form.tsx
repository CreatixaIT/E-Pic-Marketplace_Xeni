"use client";

import { useState } from "react";
import { CreditCard, Smartphone, DollarSign } from "lucide-react";
import { useCheckout } from "@/lib/checkout";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n/types";
import type { PaymentMethod } from "@/lib/checkout/types";

const getPaymentMethods = (dictionary: Dictionary): Array<{
  id: PaymentMethod;
  icon: React.ReactNode;
  title: string;
  description: string;
  available: boolean;
}> => [
  {
    id: "card",
    icon: <CreditCard className="size-5" aria-hidden />,
    title: dictionary.checkout.paymentMethod.card,
    description: dictionary.checkout.paymentMethod.cardDescription,
    available: true,
  },
  {
    id: "mobile-wallet",
    icon: <Smartphone className="size-5" aria-hidden />,
    title: dictionary.checkout.paymentMethod.mobileWallet,
    description: dictionary.checkout.paymentMethod.mobileWalletDescription,
    available: true,
  },
  {
    id: "cash-on-delivery",
    icon: <DollarSign className="size-5" aria-hidden />,
    title: dictionary.checkout.paymentMethod.cashOnDelivery,
    description: dictionary.checkout.paymentMethod.cashOnDeliveryDescription,
    available: true,
  },
];

export function PaymentMethodForm({ dictionary }: { dictionary: Dictionary }) {
  const { setPaymentMethod, advanceToNextStep, setStep } = useCheckout();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const paymentMethods = getPaymentMethods(dictionary);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMethod) {
      setPaymentMethod(selectedMethod);
      advanceToNextStep();
    }
  };

  const handleBack = () => {
    setStep("delivery-address");
  };

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 md:p-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold">{dictionary.checkout.paymentMethod.title}</h2>
        <p className="mt-2 text-sm text-muted">
          {dictionary.checkout.paymentMethod.description}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Method Options */}
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <label
              key={method.id}
              className={`relative flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-colors ${
                selectedMethod === method.id
                  ? "border-foreground bg-foreground/5"
                  : "border-border bg-background/60 hover:bg-background/80"
              } ${!method.available ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod)}
                disabled={!method.available}
                className="mt-1 size-4 accent-foreground"
                aria-describedby={`${method.id}-description`}
              />
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-foreground/10">
                    {method.icon}
                  </div>
                  <div>
                    <p className="font-medium">{method.title}</p>
                    <p
                      id={`${method.id}-description`}
                      className="mt-1 text-sm text-muted"
                    >
                      {method.description}
                    </p>
                  </div>
                </div>
              </div>
              {!method.available && (
                <span className="text-xs font-medium text-muted">
                  Coming soon
                </span>
              )}
            </label>
          ))}
        </div>

        {/* Demo Notice */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>Demo Mode:</strong> No real payment will be processed. This is a
            prototype checkout experience.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleBack}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={!selectedMethod}
            className="flex-1"
            size="lg"
          >
            {dictionary.checkout.paymentMethod.continue}
          </Button>
        </div>
      </form>
    </div>
  );
}
