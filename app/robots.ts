import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.e-pic.co'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/account', '/cart', '/checkout', '/api'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
