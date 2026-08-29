"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { CrossStoreDialog } from "@/components/cart/cross-store-dialog";
import type { Product } from "@/lib/commerce/types";
import type { Dictionary } from "@/lib/i18n/types";

interface AddToCartButtonProps {
  product: Product;
  dictionary: Dictionary;
  disabled?: boolean;
}

export function AddToCartButton({ product, dictionary, disabled = false }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [showCrossStoreDialog, setShowCrossStoreDialog] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem, clearCart, isCrossStoreCheckout } = useCart();
  const router = useRouter();

  const handleAddToCart = async () => {
    if (disabled) return;

    setIsAdding(true);

    // Check for cross-store checkout
    if (isCrossStoreCheckout(product)) {
      setShowCrossStoreDialog(true);
      setIsAdding(false);
      return;
    }

    const success = await addItem(product, quantity);
    setIsAdding(false);

    if (success) {
      setQuantity(1);
    }
  };

  const handleBuyNow = async () => {
    if (disabled) return;

    setIsAdding(true);

    // Check for cross-store checkout
    if (isCrossStoreCheckout(product)) {
      setShowCrossStoreDialog(true);
      setIsAdding(false);
      return;
    }

    const success = await addItem(product, quantity);
    setIsAdding(false);

    if (success) {
      router.push("/cart");
    }
  };

  const handleCrossStoreConfirm = async () => {
    setShowCrossStoreDialog(false);
    clearCart();
    const success = await addItem(product, quantity);
    if (success) {
      setQuantity(1);
    }
  };

  const handleCrossStoreCancel = () => {
    setShowCrossStoreDialog(false);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Quantity Selector */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted">
            {dictionary.cart.quantity}
          </span>
          <div className="flex items-center rounded-lg border border-border bg-surface">
            <button
              type="button"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="flex size-10 items-center justify-center rounded-l-lg border-r border-border text-muted transition-colors hover:bg-background disabled:opacity-50 disabled:hover:bg-transparent"
              aria-label="Decrease quantity"
            >
              <Minus className="size-4" aria-hidden />
            </button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <button
              type="button"
              onClick={incrementQuantity}
              className="flex size-10 items-center justify-center rounded-r-lg border-l border-border text-muted transition-colors hover:bg-background"
              aria-label="Increase quantity"
            >
              <Plus className="size-4" aria-hidden />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={handleAddToCart}
            disabled={disabled || isAdding}
            className="flex-1"
          >
            <ShoppingBag className="mr-2 size-4" aria-hidden />
            {isAdding ? "Adding..." : dictionary.cart.addToCart}
          </Button>
          <Button
            onClick={handleBuyNow}
            disabled={disabled || isAdding}
            variant="secondary"
            className="flex-1"
          >
            {dictionary.cart.buyNow}
          </Button>
        </div>
      </div>

      {/* Cross-Store Dialog */}
      {showCrossStoreDialog && (
        <CrossStoreDialog
          product={product}
          onConfirm={handleCrossStoreConfirm}
          onCancel={handleCrossStoreCancel}
          dictionary={dictionary}
        />
      )}
    </>
  );
}