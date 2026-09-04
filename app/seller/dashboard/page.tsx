import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SellerDashboardClient } from "@/components/seller/seller-dashboard-client";

export const metadata: Metadata = {
  title: "Seller Dashboard",
  description: "Manage your E-Pic storefront",
};

export default async function SellerDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Check if user has seller role
  if (session.user.role !== "SELLER" && session.user.role !== "ADMIN") {
    redirect("/seller"); // Redirect to seller landing page
  }

  return <SellerDashboardClient userId={session.user.id} />;
}
