import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { OrdersListClient } from "@/components/seller/orders-list-client";

export const metadata: Metadata = {
  title: "Orders",
  description: "Manage your orders",
};

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "SELLER" && session.user.role !== "ADMIN") {
    redirect("/seller");
  }

  return <OrdersListClient userId={session.user.id} />;
}
