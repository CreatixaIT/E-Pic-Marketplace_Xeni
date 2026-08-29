import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/ui/section";
import { CheckoutClient } from "@/components/checkout/checkout-client";
import { getPreferences } from "@/lib/preferences/server";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order on E-pic.",
};

export default async function CheckoutPage() {
  const { dictionary } = await getPreferences();

  return (
    <>
      <PageHeader
        eyebrow="Checkout"
        title={dictionary.checkout.title}
        description="Fast. Clear. Trustworthy."
      />

      <Section>
        <CheckoutClient dictionary={dictionary} />
      </Section>
    </>
  );
}
