import { DiscoverySection } from "@/components/home/discovery-section";
import { FeaturedStores } from "@/components/home/featured-stores";
import { Hero } from "@/components/home/hero";
import { SellerCta } from "@/components/home/seller-cta";
import { getCommerceProvider } from "@/lib/commerce";

export default async function HomePage() {
  const featured = await getCommerceProvider().getFeaturedStores();

  return (
    <>
      <Hero />
      <FeaturedStores stores={featured} />
      <DiscoverySection stores={featured} />
      <SellerCta />
    </>
  );
}
