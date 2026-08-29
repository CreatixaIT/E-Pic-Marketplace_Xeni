import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MinimalTemplate, EditorialTemplate, ImmersiveTemplate } from "@/components/stores/templates";
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

export default async function StorePage({ params }: PageProps<"/stores/[slug]">) {
  const { slug } = await params;
  const commerce = getCommerceProvider();
  const store = await commerce.getStoreBySlug(slug);

  if (!store) notFound();

  const [products, { locale, dictionary }] = await Promise.all([
    commerce.getProductsByStore(store.id),
    getPreferences(),
  ]);

  const template = store.visualConfig.template;

  switch (template) {
    case "minimal":
      return (
        <MinimalTemplate
          store={store}
          products={products}
          dictionary={dictionary}
          locale={locale}
        />
      );
    case "editorial":
      return (
        <EditorialTemplate
          store={store}
          products={products}
          dictionary={dictionary}
          locale={locale}
        />
      );
    case "immersive":
      return (
        <ImmersiveTemplate
          store={store}
          products={products}
          dictionary={dictionary}
          locale={locale}
        />
      );
    default:
      // Fallback to minimal if template is unknown
      return (
        <MinimalTemplate
          store={store}
          products={products}
          dictionary={dictionary}
          locale={locale}
        />
      );
  }
}
