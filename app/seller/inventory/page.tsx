import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Inventory Redirect",
  description: "Inventory management is handled in Xeni",
};

export default async function InventoryPage() {
  const xeniUrl = process.env.NEXT_PUBLIC_XENI_URL || "https://xeni.xentroinfotech.com";
  redirect(`${xeniUrl}/en/dashboard/products`);
}
