import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { InventoryClient } from "@/components/seller/inventory-client";

export const metadata: Metadata = {
  title: "Inventory",
  description: "Manage your inventory",
};

export default async function InventoryPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "SELLER" && session.user.role !== "ADMIN") {
    redirect("/seller");
  }

  return <InventoryClient userId={session.user.id} />;
}
