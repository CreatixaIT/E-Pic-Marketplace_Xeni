import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ProductsListClient } from "@/components/seller/products-list-client";

export const metadata: Metadata = {
  title: "Products",
  description: "Manage your products",
};

export default async function ProductsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "SELLER" && session.user.role !== "ADMIN") {
    redirect("/seller");
  }

  return <ProductsListClient userId={session.user.id} />;
}
