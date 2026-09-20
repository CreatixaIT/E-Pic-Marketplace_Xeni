import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Products Redirect",
  description: "Product management is handled in Xeni",
};

export default async function ProductsPage() {
  // Redirect to Xeni dashboard for product management
  const xeniUrl = process.env.NEXT_PUBLIC_XENI_URL || "https://xeni.xentroinfotech.com";
  redirect(`${xeniUrl}/en/dashboard/products`);
}
