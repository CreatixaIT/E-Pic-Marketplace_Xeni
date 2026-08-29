"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/commerce/types";
import type { Dictionary } from "@/lib/i18n/types";

interface CrossStoreDialogProps {
  product: Product;
  onConfirm: () => void;
  onCancel: () => void;
  dictionary: Dictionary;
}

export function CrossStoreDialog({
  product,
  onConfirm,
  onCancel,
  dictionary,
}: CrossStoreDialogProps) {
  const { storeName } = useCart();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
            <AlertCircle className="size-5 text-amber-500" aria-hidden />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">
              {dictionary.cart.crossStoreTitle}
            </h3>
            <p className="mt-2 text-sm text-muted">
              {dictionary.cart.crossStoreDescription}
            </p>
            <div className="mt-4 rounded-xl border border-border bg-background/60 p-3">
              <p className="text-sm">
                <span className="font-medium">Current cart:</span> {storeName}
              </p>
              <p className="mt-1 text-sm">
                <span className="font-medium">New item:</span> {product.storeName}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            {dictionary.cart.keepCurrentCart}
          </Button>
          <Button
            onClick={onConfirm}
            className="w-full sm:w-auto"
          >
            {dictionary.cart.clearAndAdd}
          </Button>
        </div>
      </div>
    </div>
  );
}