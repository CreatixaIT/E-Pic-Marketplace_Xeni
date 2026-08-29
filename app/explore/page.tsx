import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ProductGrid } from "@/components/products/product-grid";
import { Section, SectionHeading } from "@/components/ui/section";
import { StoreGrid } from "@/components/stores/store-grid";
import { getCommerceProvider } from "@/lib/commerce";
import { getPreferences } from "@/lib/preferences/server";

export const metadata: Metadata = {
  title: "Explore stores",
  description:
    "Browse the brands building their own storefront worlds on E-pic.",
};

export default async function ExplorePage() {
  const commerce = getCommerceProvider();
  const [stores, products, { locale, dictionary }] = await Promise.all([
    commerce.getStores(),
    commerce.getProducts(),
    getPreferences(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Explore"
        title="Every world currently open on E-pic"
        description="A preview of the directory. Filtering, search and live inventory arrive with the commerce integration."
      />

      <Section>
        <SectionHeading
          eyebrow="Stores"
          title="Brands on the marketplace"
          description={`${stores.length} storefronts, each running its own experience.`}
        />
        <div className="mt-12">
          <StoreGrid stores={stores} />
        </div>
      </Section>

      <Section className="border-t border-border bg-surface/40">
        <SectionHeading
          eyebrow="Products"
          title="A slice of what's inside"
          description="Sample listings pulled through the commerce layer's mock provider."
        />
        <div className="mt-12">
          <ProductGrid
            products={products}
            badges={dictionary.badges}
            locale={locale}
          />
        </div>
      </Section>
    </>
  );
}
