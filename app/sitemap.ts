import { MetadataRoute } from 'next'
import { getCommerceProvider } from '@/lib/commerce'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const commerce = getCommerceProvider()
  const [stores, products] = await Promise.all([
    commerce.getStores(),
    commerce.getProducts(),
  ])

  const baseUrl = 'https://www.e-pic.co'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/stores`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/seller`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Store pages
  const storePages: MetadataRoute.Sitemap = stores.map((store) => ({
    url: `${baseUrl}/stores/${store.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Product pages
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...storePages, ...productPages]
}
