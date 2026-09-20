import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Xeni Seller Dashboard",
  description: "Manage your online business with Xeni - your AI-powered seller operating system",
};

export default async function XeniPage() {
  // Redirect to the configured Xeni URL
  // NEXT_PUBLIC_XENI_URL must be set in environment variables
  const xeniUrl = process.env.NEXT_PUBLIC_XENI_URL;
  if (!xeniUrl) {
    throw new Error("NEXT_PUBLIC_XENI_URL environment variable is not configured. Please set this variable to your Xeni seller dashboard URL.");
  }
  redirect(xeniUrl);
}
