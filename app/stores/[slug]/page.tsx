import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { ProductGrid } from "@/components/products/product-grid";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { getCommerceProvider } from "@/lib/commerce";
import { getPreferences } from "@/lib/preferences/server";

export async function generateMetadata({
  params,
}: PageProps<"/stores/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const store = await getCommerceProvider().getStoreBySlug(slug);

  if (!store) return { title: "Store not found" };

  return { title: store.name, description: store.tagline };
}

/**
 * Minimal storefront destination so "Enter Store" is never a broken link. The
 * full branded store experience is a later milestone.
 */
export default async function StorePage({ params }: PageProps<"/stores/[slug]">) {
  const { slug } = await params;
  const commerce = getCommerceProvider();
  const store = await commerce.getStoreBySlug(slug);

  if (!store) notFound();

  const [products, { locale, dictionary }] = await Promise.all([
    commerce.getProductsByStore(store.id),
    getPreferences(),
  ]);

  return (
    <>
      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className={`absolute inset-0 bg-gradient-to-br ${store.theme.gradient} opacity-25`}
        />
        <div className="relative">
          <PageHeader
            eyebrow={store.categoryLabel}
            title={store.name}
            description={store.description}
          >
            <div className="flex flex-wrap items-center gap-3">
              <ButtonLink href="/explore" variant="secondary">
                {dictionary.worlds.viewAllStores}
              </ButtonLink>
              <p className="text-sm text-muted">
                {store.productCount} {dictionary.worlds.products} ·{" "}
                {store.location}
              </p>
            </div>
          </PageHeader>
        </div>
      </div>

      <Section>
        <SectionHeading eyebrow="Catalogue" title={store.tagline} />
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
