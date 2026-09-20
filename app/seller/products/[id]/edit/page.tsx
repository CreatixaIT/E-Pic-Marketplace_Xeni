import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Product Redirect",
  description: "Product editing is handled in Xeni",
};

export default async function EditProductPage() {
  const xeniUrl = process.env.NEXT_PUBLIC_XENI_URL;
  if (!xeniUrl) {
    throw new Error("NEXT_PUBLIC_XENI_URL environment variable is not configured.");
  }
  redirect(`${xeniUrl}/en/dashboard/products`);
}
