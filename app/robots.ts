import type { MetadataRoute } from 'next';
import { SITE_URL, absoluteUrl } from '@/utils/site';

// /robots.txt
export default function robots(): MetadataRoute.Robots {
  // Keep preview/staging deployments out of search results.
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Next.js internals are fetched by crawlers for rendering, so they stay allowed.
        disallow: ['/api/'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE_URL,
  };
}
