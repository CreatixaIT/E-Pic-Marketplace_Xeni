import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { StoreGrid } from "@/components/stores/store-grid";
import { Section, SectionHeading } from "@/components/ui/section";
import { getCommerceProvider } from "@/lib/commerce";

export const metadata: Metadata = {
  title: "Stores - E-Pic Marketplace",
  description: "Discover amazing stores and sellers from across the E-Pic marketplace.",
};

export default async function StoresPage() {
  const commerce = getCommerceProvider();
  const stores = await commerce.getStores();

  return (
    <>
      <PageHeader
        eyebrow="Marketplace"
        title="Discover Stores"
        description={`Explore ${stores.length} unique storefronts from sellers across the marketplace.`}
      />

      <Section>
        <SectionHeading
          eyebrow="All Stores"
          title="Browse Stores"
          description="Each store offers a unique shopping experience powered by Xeni."
        />
        <div className="mt-12">
          <StoreGrid stores={stores} />
        </div>
      </Section>
    </>
  );
}
