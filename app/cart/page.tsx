import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/ui/section";
import { CartClient } from "@/components/cart/cart-client";
import { getPreferences } from "@/lib/preferences/server";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your E-pic bag. Checkout arrives with the commerce integration.",
};

export default async function CartPage() {
  const { dictionary } = await getPreferences();

  return (
    <>
      <PageHeader
        eyebrow="Cart"
        title="Your bag"
        description="Review your items before checkout."
      />

      <Section>
        <CartClient dictionary={dictionary} />
      </Section>
    </>
  );
}
