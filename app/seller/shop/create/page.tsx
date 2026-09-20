import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Create Shop Redirect",
  description: "Shop creation is handled in Xeni",
};

export default async function CreateShopPage() {
  const xeniUrl = process.env.NEXT_PUBLIC_XENI_URL || "https://xeni.xentroinfotech.com";
  redirect(`${xeniUrl}/en/dashboard/shop`);
}
