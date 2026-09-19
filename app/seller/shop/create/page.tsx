import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Create Shop Redirect",
  description: "Shop creation is handled in Xeni",
};

export default async function CreateShopPage() {
  redirect("https://xeni.xentroinfotech.com/en/dashboard/shop");
}
