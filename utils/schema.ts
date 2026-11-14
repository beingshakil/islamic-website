// schema.org JSON-LD builders. Render with <JsonLd data={...} /> from a server component.
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from '@/utils/site';

type Thing = Record<string, unknown>;

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const organizationSchema = (): Thing => ({
  '@type': 'Organization',
  '@id': ORG_ID,
  name: SITE_NAME,
  url: SITE_URL,
  logo: absoluteUrl('/favicon.ico'),
  description: SITE_DESCRIPTION,
});

export const websiteSchema = (inLanguage: string): Thing => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage,
  publisher: { '@id': ORG_ID },
});

export interface Crumb { name: string; path: string }

export const breadcrumbSchema = (crumbs: Crumb[]): Thing => ({
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: absoluteUrl(c.path),
  })),
});

export const webPageSchema = (opts: { path: string; name: string; description: string; inLanguage: string; type?: string; about?: Thing; dateModified?: string }): Thing => ({
  '@type': opts.type ?? 'WebPage',
  '@id': `${absoluteUrl(opts.path)}#webpage`,
  url: absoluteUrl(opts.path),
  name: opts.name,
  description: opts.description,
  inLanguage: opts.inLanguage,
  isPartOf: { '@id': WEBSITE_ID },
  ...(opts.about ? { about: opts.about } : {}),
  ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
});

export const faqSchema = (faqs: { q: string; a: string }[]): Thing => ({
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export const cityPlaceSchema = (city: string, country: string): Thing => ({
  '@type': 'City',
  name: city,
  containedInPlace: { '@type': 'Country', name: country },
});

export const itemListSchema = (name: string, items: { name: string; path: string }[]): Thing => ({
  '@type': 'ItemList',
  name,
  numberOfItems: items.length,
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    url: absoluteUrl(it.path),
  })),
});

/** Wraps nodes into one @graph document. */
export const graph = (...nodes: Thing[]) => ({ '@context': 'https://schema.org', '@graph': nodes });
