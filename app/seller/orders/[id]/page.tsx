import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Order Details Redirect",
  description: "Order details are managed in Xeni",
};

export default async function OrderDetailPage() {
  redirect("https://xeni.xentroinfotech.com/en/dashboard/orders");
}
