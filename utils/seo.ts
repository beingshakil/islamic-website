import type { Metadata } from 'next';
import { DEFAULT_LOCALE, INDEXED_LOCALES, LOCALES, hasLocale, isIndexedLocale, localizePath, type Locale } from '@/utils/i18n';
import { SITE_NAME } from '@/utils/site';

interface PageMetadataInput {
  lang: string;
  /** Path without the language prefix, e.g. "/countries". */
  path: string;
  title: string;
  description: string;
  /** Use the title as-is (no " | PrayerTimes" suffix). */
  absoluteTitle?: boolean;
  /** false for thin/placeholder pages: noindex, follow. */
  index?: boolean;
  type?: 'website' | 'article';
}

/** hreflang alternates for indexed languages plus x-default. */
export const languageAlternates = (path: string) => ({
  ...Object.fromEntries(INDEXED_LOCALES.map((l) => [LOCALES[l].hreflang, localizePath(l, path)])),
  'x-default': localizePath(DEFAULT_LOCALE, path),
});

/**
 * Builds consistent page metadata: title, description, canonical, hreflang,
 * Open Graph, Twitter and robots. Non-indexed languages canonicalize to English.
 */
export function pageMetadata({ lang, path, title, description, absoluteTitle, index = true, type = 'website' }: PageMetadataInput): Metadata {
  const locale: Locale = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  const indexable = index && isIndexedLocale(locale);
  const canonical = localizePath(isIndexedLocale(locale) ? locale : DEFAULT_LOCALE, path);
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
      languages: index ? languageAlternates(path) : undefined,
    },
    robots: indexable
      ? { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } }
      : { index: false, follow: true },
    openGraph: {
      type,
      url: canonical,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      locale: LOCALES[locale].ogLocale,
    },
    twitter: {
      card: 'summary',
      title: fullTitle,
      description,
    },
  };
}

/** Metadata for pages that are not built yet: titled, but kept out of search results. */
export const comingSoonMetadata = (lang: string, path: string, title: string): Metadata =>
  pageMetadata({ lang, path, title: `${title} (Coming Soon)`, description: `${title} is coming soon to ${SITE_NAME}.`, index: false });

/**
 * Indexable pages without dynamic params, used by the sitemap and llms.txt.
 * When a "Coming Soon" page gets real content, add it here (and switch its
 * metadata from comingSoonMetadata to pageMetadata).
 */
export const INDEXABLE_STATIC_ROUTES: {
  path: string;
  name: string;
  summary: string;
  priority: number;
  changeFrequency: 'daily' | 'weekly' | 'monthly';
}[] = [
  { path: '/', name: 'Prayer Times Today', summary: "Today's prayer times for the visitor's city with a live countdown to the next prayer.", priority: 1, changeFrequency: 'daily' },
  { path: '/calendar', name: 'Islamic Calendar', summary: 'Hijri calendar for the current Islamic year with Gregorian dates for every day, moon-sighting adjustment by country, and Ramadan/Eid dates.', priority: 0.9, changeFrequency: 'daily' },
  { path: '/countries', name: 'Prayer Times by Country', summary: 'Directory of countries with their time zones; each links to that country\'s prayer timetable.', priority: 0.9, changeFrequency: 'weekly' },
];
