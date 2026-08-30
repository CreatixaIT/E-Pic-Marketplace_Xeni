"use client";

import { useDictionary } from "@/lib/i18n/client";
import { Package } from "lucide-react";

export function OrdersSection() {
  const dict = useDictionary();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{dict.account.orderHistory}</h2>

      <div className="text-center py-12 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <Package className="size-8 text-muted" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{dict.account.noOrders}</h3>
        <p className="text-muted max-w-md mx-auto">
          {dict.account.noOrdersDescription}
        </p>
      </div>
    </div>
  );
}