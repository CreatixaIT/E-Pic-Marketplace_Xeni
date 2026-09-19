import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Seller Dashboard Redirect",
  description: "Seller dashboard is managed in Xeni",
};

export default async function SellerDashboardPage() {
  // Redirect all seller dashboard requests to Xeni
  // Sellers should manage their business through Xeni's dashboard
  redirect("https://xeni.xentroinfotech.com/en/dashboard");
}
