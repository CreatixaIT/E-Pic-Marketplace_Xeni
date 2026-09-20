import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Xeni Seller Dashboard",
  description: "Manage your online business with Xeni - your AI-powered seller operating system",
};

export default async function XeniPage() {
  // Redirect to the configured Xeni URL
  // This allows the Xeni domain to be configurable via environment variable
  const xeniUrl = process.env.NEXT_PUBLIC_XENI_URL || "https://xeni.xentroinfotech.com";
  redirect(xeniUrl);
}
