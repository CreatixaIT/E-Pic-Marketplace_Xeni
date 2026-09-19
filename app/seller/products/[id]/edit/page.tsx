import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Product Redirect",
  description: "Product editing is handled in Xeni",
};

export default async function EditProductPage() {
  redirect("https://xeni.xentroinfotech.com/en/dashboard/products");
}
