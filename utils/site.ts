// Site-wide constants used by metadata, sitemap, robots.txt, llms.txt and JSON-LD.

/**
 * Absolute origin of the live site, without a trailing slash.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://example.com).
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
  'http://localhost:3000'
).replace(/\/+$/, '');

export const SITE_NAME = 'PrayerTimes';
export const SITE_TAGLINE = 'Accurate Prayer Times, Namaz & Azan Times Worldwide';
export const SITE_DESCRIPTION =
  'Accurate daily prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha) for cities worldwide, with live countdown, Sehri & Iftar times and Islamic tools.';

/** Default calculation used for server-rendered times (matches the client defaults). */
export const DEFAULT_METHOD = { school: '1', method: '1', tune: '' } as const;
export const DEFAULT_METHOD_LABEL = 'University of Islamic Sciences, Karachi (Hanafi Asr)';

export const absoluteUrl = (path = '/') => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
