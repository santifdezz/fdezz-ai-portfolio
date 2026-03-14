import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/_next/', '/*.json$', '/api/'],
      crawlDelay: 1,
    },
    sitemap: 'https://fdezz.ai/sitemap.xml',
  }
}
