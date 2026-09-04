import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { BuyerOrderDetailClient } from "@/components/buyer/buyer-order-detail-client";

export const metadata: Metadata = {
  title: "Order Details",
  description: "View order details",
};

export default async function BuyerOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <BuyerOrderDetailClient orderId={params.id} userId={session.user.id} />;
}
