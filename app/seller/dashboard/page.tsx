import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Seller Dashboard Redirect",
  description: "Seller dashboard is managed in Xeni",
};

export default async function SellerDashboardPage() {
  // Redirect all seller dashboard requests to Xeni
  // Sellers should manage their business through Xeni's dashboard
  const xeniUrl = process.env.NEXT_PUBLIC_XENI_URL || "https://xeni.xentroinfotech.com";
  redirect(`${xeniUrl}/en/dashboard`);
}
