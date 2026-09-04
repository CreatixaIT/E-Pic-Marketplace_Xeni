import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { CreateProductClient } from "@/components/seller/create-product-client";

export const metadata: Metadata = {
  title: "Create Product",
  description: "Create a new product",
};

export default async function CreateProductPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "SELLER" && session.user.role !== "ADMIN") {
    redirect("/seller");
  }

  return <CreateProductClient userId={session.user.id} />;
}
