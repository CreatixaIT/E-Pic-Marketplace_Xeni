import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Orders Redirect",
  description: "Order management is handled in Xeni",
};

export default async function OrdersPage() {
  redirect("https://xeni.xentroinfotech.com/en/dashboard/orders");
}
