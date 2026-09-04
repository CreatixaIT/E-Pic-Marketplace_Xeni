import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { EditProductClient } from "@/components/seller/edit-product-client";

export const metadata: Metadata = {
  title: "Edit Product",
  description: "Edit product details",
};

export default async function EditProductPage({
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

  return <EditProductClient productId={params.id} userId={session.user.id} />;
}
