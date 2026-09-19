import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ProductGrid } from "@/components/products/product-grid";
import { Section, SectionHeading } from "@/components/ui/section";
import { StoreGrid } from "@/components/stores/store-grid";
import { getCommerceProvider } from "@/lib/commerce";
import { getPreferences } from "@/lib/preferences/server";
import { SearchBar } from "@/components/search/search-bar";
import { CategoryFilter } from "@/components/search/category-filter";

export const metadata: Metadata = {
  title: "Explore E-Pic Marketplace",
  description: "Discover amazing products and stores from across the E-Pic marketplace.",
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { search?: string; category?: string };
}) {
  const commerce = getCommerceProvider();
  const search = searchParams.search || "";
  const category = searchParams.category;

  const [stores, products, categories, { locale, dictionary }] = await Promise.all([
    commerce.getStores(),
    category ? commerce.getProductsByCategory(category as any) : commerce.getProducts(),
    commerce.getCategories(),
    getPreferences(),
  ]);

  // Filter products by search if provided
  const filteredProducts = search
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase()) ||
          product.storeName.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  return (
    <>
      <PageHeader
        eyebrow="Marketplace"
        title="Discover Amazing Products"
        description="Explore the best products and stores from sellers across the E-Pic marketplace."
      />

      {/* Search and Filter Section */}
      <Section>
        <div className="max-w-4xl mx-auto space-y-6">
          <SearchBar />
          <CategoryFilter categories={categories} selectedCategory={category} />
        </div>
      </Section>

      {/* Search Results */}
      {search && (
        <Section>
          <SectionHeading
            eyebrow="Search Results"
            title={`Results for "${search}"`}
            description={`${filteredProducts.length} products found`}
          />
          <div className="mt-12">
            <ProductGrid
              products={filteredProducts}
              badges={dictionary.badges}
              locale={locale}
            />
          </div>
        </Section>
      )}

      {/* Featured Products */}
      {!search && filteredProducts.length > 0 && (
        <Section>
          <SectionHeading
            eyebrow="All Products"
            title="Browse Products"
            description={`${filteredProducts.length} products available`}
          />
          <div className="mt-12">
            <ProductGrid
              products={filteredProducts}
              badges={dictionary.badges}
              locale={locale}
            />
          </div>
        </Section>
      )}

      {/* Stores */}
      {stores.length > 0 && (
        <Section className="border-t border-border bg-surface/40">
          <SectionHeading
            eyebrow="Stores"
            title="Featured Stores"
            description={`${stores.length} storefronts, each running its own experience.`}
          />
          <div className="mt-12">
            <StoreGrid stores={stores} />
          </div>
        </Section>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <Section>
          <div className="text-center py-16">
            <p className="text-lg text-muted">
              {search
                ? `No products found for "${search}"`
                : "No products available yet"}
            </p>
          </div>
        </Section>
      )}
    </>
  );
}
