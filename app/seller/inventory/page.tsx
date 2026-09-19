import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Inventory Redirect",
  description: "Inventory management is handled in Xeni",
};

export default async function InventoryPage() {
  redirect("https://xeni.xentroinfotech.com/en/dashboard/products");
}
