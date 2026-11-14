// Single source of truth for location-based prayer time URLs.
// Paths here have no language prefix; <Link> from components/LocaleLink adds /{lang}.
//
//   /countries                                 -> list of all countries
//   /countries/{country}                       -> country (currently opens its default city)
//   /countries/{country}/prayer-times-{city}   -> full daily schedule for a city
//   /countries/{country}/{waqt}-time-{city}    -> single prayer (waqt) detail for a city

export const WAQTS = ['fajr', 'sunrise', 'dhuhr', 'asr', 'sunset', 'maghrib', 'isha'] as const;
export type Waqt = (typeof WAQTS)[number];

const CITY_PREFIX = 'prayer-times-';
const WAQT_PATTERN = new RegExp(`^(${WAQTS.join('|')})-time-(.+)$`);

/** "New York" -> "new-york" */
export const toSlug = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');

/** "new-york" -> "New York" (display / API lookup) */
export const fromSlug = (slug: string) =>
  decodeURIComponent(slug)
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

export const countriesPath = () => '/countries';

export const countryPath = (country: string) => `/countries/${toSlug(country)}`;

export const cityPrayerTimesPath =(country: string, city: string) =>
  `/countries/${toSlug(country)}/${CITY_PREFIX}${toSlug(city)}`;

export const waqtTimePath = (waqt: string, country: string, city: string) =>
  `/countries/${toSlug(country)}/${toSlug(waqt)}-time-${toSlug(city)}`;

export type LocationRoute =
  | { kind: 'city'; citySlug: string }
  | { kind: 'waqt'; waqt: Waqt; citySlug: string };

/** Parses the last segment of /countries/{country}/{slug}. Returns null for unknown shapes. */
export const parseLocationSlug = (slug: string): LocationRoute | null => {
  const s = decodeURIComponent(slug).toLowerCase();

  if (s.startsWith(CITY_PREFIX) && s.length > CITY_PREFIX.length) {
    return { kind: 'city', citySlug: s.slice(CITY_PREFIX.length) };
  }

  const m = s.match(WAQT_PATTERN);
  if (m) return { kind: 'waqt', waqt: m[1] as Waqt, citySlug: m[2] };

  return null;
};

/** /calendar/{country}/islamic-date-today -> today's Hijri (Arabic) date in a country */
export const islamicDatePath = (country: string) => `/calendar/${toSlug(country)}/islamic-date-today`;

/** /calendar -> Islamic (Hijri) calendar with monthly view and key dates */
export const calendarPath = () => '/calendar';
