import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Truck } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ProductGrid } from "@/components/products/product-grid";
import { Badge } from "@/components/ui/badge";
import { getCommerceProvider } from "@/lib/commerce";
import { getPreferences } from "@/lib/preferences/server";
import { formatMoney } from "@/lib/utils";
import { AddToCartButton } from "@/components/products/add-to-cart-button";

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCommerceProvider().getProductBySlug(slug);

  if (!product) return { title: "Product not found" };

  return { 
    title: `${product.name} — ${product.storeName}`,
    description: product.description 
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const commerce = getCommerceProvider();
  const product = await commerce.getProductBySlug(slug);

  if (!product) notFound();

  const [store, relatedProducts, { locale, dictionary }] = await Promise.all([
    commerce.getStoreById(product.storeId),
    commerce.getProductsByStore(product.storeId),
    getPreferences(),
  ]);

  // Filter out the current product from related products
  const filteredRelatedProducts = relatedProducts
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  const availabilityLabel = product.availability === "in-stock" 
    ? dictionary.cart.inStock 
    : product.availability === "low-stock" 
    ? dictionary.cart.lowStock 
    : dictionary.cart.outOfStock;

  return (
    <>
      <PageHeader
        eyebrow={product.storeName}
        title={product.name}
        description={product.description}
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Product Image */}
            <div className="relative overflow-hidden rounded-3xl bg-surface">
              <div
                role="img"
                aria-label={product.image.alt}
                className={`aspect-square bg-gradient-to-br ${product.image.gradient}`}
              />
              {product.badge && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-background/70 text-foreground backdrop-blur">
                    {dictionary.badges[product.badge]}
                  </Badge>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-sm text-muted">
                {store && (
                  <Link
                    href={`/stores/${store.slug}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {product.storeName}
                  </Link>
                )}
                {!store && <span>{product.storeName}</span>}
                <span>·</span>
                <span>{product.categoryLabel}</span>
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                {product.name}
              </h1>

              <p className="mt-4 text-lg text-muted leading-relaxed">
                {product.description}
              </p>

              <div className="mt-6">
                <p className="text-3xl font-semibold">
                  {formatMoney(product.price, locale)}
                </p>
              </div>

              {/* Availability */}
              <div className="mt-4 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                  product.availability === "out-of-stock" ? "text-red-500" :
                  product.availability === "low-stock" ? "text-amber-500" :
                  "text-emerald-500"
                }`}>
                  <span className="size-2 rounded-full bg-current" />
                  {availabilityLabel}
                </span>
              </div>

              {/* Highlights */}
              {product.highlights && product.highlights.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-semibold tracking-wide uppercase text-muted">
                    {dictionary.product.highlights}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {product.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-foreground/50" />
                        <span className="text-muted">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Add to Cart Section */}
              <div className="mt-8">
                <AddToCartButton 
                  product={product} 
                  dictionary={dictionary}
                  disabled={product.availability === "out-of-stock"}
                />
              </div>

              {/* Shipping Info */}
              <div className="mt-8 rounded-xl border border-border bg-background/60 p-4">
                <div className="flex items-start gap-3">
                  <Truck className="mt-0.5 size-5 text-muted" aria-hidden />
                  <div>
                    <p className="text-sm font-medium">Free shipping</p>
                    <p className="mt-1 text-xs text-muted">
                      Orders over $50 ship free. Estimated delivery: 5-7 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Related Products */}
      {filteredRelatedProducts.length > 0 && (
        <Section className="bg-surface">
          <Container>
            <h2 className="text-2xl font-semibold">
              {dictionary.product.relatedProducts}
            </h2>
            <div className="mt-8">
              <ProductGrid
                products={filteredRelatedProducts}
                badges={dictionary.badges}
                locale={locale}
              />
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}