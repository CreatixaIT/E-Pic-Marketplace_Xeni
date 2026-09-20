import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { StoreGrid } from "@/components/stores/store-grid";
import { Section, SectionHeading } from "@/components/ui/section";
import { getCommerceProvider } from "@/lib/commerce";
import { getPreferences } from "@/lib/preferences/server";

export const metadata: Metadata = {
  title: "Stores - E-Pic Marketplace",
  description: "Discover amazing stores and sellers from across the E-Pic marketplace.",
};

export default async function StoresPage() {
  const commerce = getCommerceProvider();
  const stores = await commerce.getStores();
  const { dictionary } = await getPreferences();

  return (
    <>
      <PageHeader
        eyebrow={dictionary.worlds.eyebrow}
        title={dictionary.worlds.title}
        description={dictionary.worlds.description}
      />

      <Section>
        <SectionHeading
          eyebrow={dictionary.worlds.viewAllStores}
          title={dictionary.nav.stores}
          description={dictionary.worlds.storeDescription}
        />
        <div className="mt-12">
          <StoreGrid stores={stores} />
        </div>
      </Section>
    </>
  );
}
