import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { OrderDetailClient } from "@/components/seller/order-detail-client";

export const metadata: Metadata = {
  title: "Order Details",
  description: "View order details",
};

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "SELLER" && session.user.role !== "ADMIN") {
    redirect("/seller");
  }

  return <OrderDetailClient orderId={params.id} userId={session.user.id} />;
}
