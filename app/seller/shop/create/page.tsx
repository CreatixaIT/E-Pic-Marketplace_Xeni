import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { CreateShopClient } from "@/components/seller/create-shop-client";

export const metadata: Metadata = {
  title: "Create Shop",
  description: "Create your E-Pic storefront",
};

export default async function CreateShopPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "SELLER" && session.user.role !== "ADMIN") {
    redirect("/seller");
  }

  return <CreateShopClient userId={session.user.id} />;
}
