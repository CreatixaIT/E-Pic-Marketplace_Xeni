import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Create Product Redirect",
  description: "Product creation is handled in Xeni",
};

export default async function CreateProductPage() {
  redirect("https://xeni.xentroinfotech.com/en/dashboard/products");
}
