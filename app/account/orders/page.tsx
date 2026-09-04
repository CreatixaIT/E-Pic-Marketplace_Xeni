import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { BuyerOrdersClient } from "@/components/buyer/buyer-orders-client";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View your order history",
};

export default async function BuyerOrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <BuyerOrdersClient userId={session.user.id} />;
}
