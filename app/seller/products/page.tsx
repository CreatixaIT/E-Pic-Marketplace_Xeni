import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Products Redirect",
  description: "Product management is handled in Xeni",
};

export default async function ProductsPage() {
  // Redirect to Xeni dashboard for product management
  const xeniUrl = process.env.NEXT_PUBLIC_XENI_URL;
  if (!xeniUrl) {
    throw new Error("NEXT_PUBLIC_XENI_URL environment variable is not configured.");
  }
  redirect(`${xeniUrl}/en/dashboard/products`);
}
