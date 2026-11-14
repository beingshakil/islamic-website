import type { MetadataRoute } from 'next';
import { COUNTRIES } from '@/utils/countries';
import { INDEXED_LOCALES, localizePath } from '@/utils/i18n';
import { INDEXABLE_STATIC_ROUTES, languageAlternates } from '@/utils/seo';
import { cityPrayerTimesPath, islamicDatePath, waqtTimePath } from '@/utils/routes';
import { PRAYERS } from '@/utils/prayerContent';
import { absoluteUrl } from '@/utils/site';

// /sitemap.xml — every indexable URL in every indexed language, with hreflang alternates.
// Prayer times change daily, so the sitemap is regenerated daily too.
export const revalidate = 86400;

type Entry = MetadataRoute.Sitemap[number];

const entries = (path: string, priority: number, changeFrequency: Entry['changeFrequency'], lastModified: Date): Entry[] => {
  const languages = Object.fromEntries(
    Object.entries(languageAlternates(path)).map(([hreflang, href]) => [hreflang, absoluteUrl(href)])
  );
  return INDEXED_LOCALES.map((locale) => ({
    url: absoluteUrl(localizePath(locale, path)),
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages },
  }));
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = INDEXABLE_STATIC_ROUTES.flatMap((r) => entries(r.path, r.priority, r.changeFrequency, now));

  // City timetable + each of the five prayers, for every country's main city.
  // (Sunrise/Sunset pages are noindex and intentionally left out.)
  const locationPages = COUNTRIES.flatMap((c) => [
    ...entries(cityPrayerTimesPath(c.name, c.city), 0.8, 'daily', now),
    ...PRAYERS.flatMap((p) => entries(waqtTimePath(p, c.name, c.city), 0.7, 'daily', now)),
  ]);

  // Today's Islamic (Hijri) date per country.
  const islamicDatePages = COUNTRIES.flatMap((c) => entries(islamicDatePath(c.name), 0.8, 'daily', now));

  return [...staticPages, ...locationPages, ...islamicDatePages];
}
