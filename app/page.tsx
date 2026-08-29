import { CuratedCollections } from "@/components/home/curated-collections";
import { ProductDiscovery } from "@/components/home/product-discovery";
import { PromoHero } from "@/components/home/promo-hero";
import { SellerCta } from "@/components/home/seller-cta";
import { StoreWorlds } from "@/components/home/store-worlds";
import { getCommerceProvider } from "@/lib/commerce";
import { getPreferences } from "@/lib/preferences/server";

export default async function HomePage() {
  const commerce = getCommerceProvider();

  const [
    { locale, dictionary },
    slides,
    products,
    categories,
    trending,
    featured,
    newArrivals,
    stores,
  ] = await Promise.all([
    getPreferences(),
    commerce.getPromoSlides(),
    commerce.getProducts(),
    commerce.getCategories(),
    commerce.getCollection("trending"),
    commerce.getCollection("featured"),
    commerce.getCollection("new-arrivals"),
    commerce.getStores(),
  ]);

  return (
    <>
      <PromoHero slides={slides} copy={dictionary.hero} />
      <ProductDiscovery
        products={products}
        categories={categories}
        copy={dictionary.discovery}
        badges={dictionary.badges}
        locale={locale}
      />
      <CuratedCollections
        tabs={[
          { id: "trending", products: trending },
          { id: "featured", products: featured },
          { id: "new-arrivals", products: newArrivals },
        ]}
        copy={dictionary.collections}
        badges={dictionary.badges}
        locale={locale}
      />
      <StoreWorlds stores={stores} copy={dictionary.worlds} />
      <SellerCta copy={dictionary.seller} />
    </>
  );
}
