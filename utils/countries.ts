import { toSlug } from '@/utils/routes';

// Countries shown on /{lang}/countries (and in the sitemap / llms.txt), in display order.
// `timezone` is an IANA zone (the GMT offset is computed from it, so DST is handled).
// `city` is the default city a country link opens.
// `hijriAdjust`: days to shift the Umm al-Qura (Saudi) Hijri date for countries that follow
// local moon sighting. -1 = usually one day behind Saudi Arabia. Adjust if a month starts differently.
export interface Country {
  name: string;
  timezone: string;
  city: string;
  hijriAdjust?: number;
}

export const COUNTRIES: Country[] = [
  { name: 'Bangladesh', timezone: 'Asia/Dhaka', city: 'Dhaka', hijriAdjust: -1 },
  { name: 'India', timezone: 'Asia/Kolkata', city: 'New Delhi', hijriAdjust: -1 },
  { name: 'Algeria', timezone: 'Africa/Algiers', city: 'Algiers' },
  { name: 'Turkey', timezone: 'Europe/Istanbul', city: 'Istanbul' },
  { name: 'Saudi Arabia', timezone: 'Asia/Riyadh', city: 'Makkah' },
  { name: 'Indonesia', timezone: 'Asia/Jakarta', city: 'Jakarta' },
  { name: 'Pakistan', timezone: 'Asia/Karachi', city: 'Islamabad', hijriAdjust: -1 },
  { name: 'Malaysia', timezone: 'Asia/Kuala_Lumpur', city: 'Kuala Lumpur' },
  { name: 'United States', timezone: 'America/New_York', city: 'New York' },
  { name: 'United Kingdom', timezone: 'Europe/London', city: 'London' },
  { name: 'Mauritania', timezone: 'Africa/Nouakchott', city: 'Nouakchott' },
  { name: 'United Arab Emirates', timezone: 'Asia/Dubai', city: 'Dubai' },
  { name: 'Morocco', timezone: 'Africa/Casablanca', city: 'Rabat' },
  { name: 'Singapore', timezone: 'Asia/Singapore', city: 'Singapore' },
  { name: 'France', timezone: 'Europe/Paris', city: 'Paris' },
  { name: 'Canada', timezone: 'America/Toronto', city: 'Toronto' },
  { name: 'Syria', timezone: 'Asia/Damascus', city: 'Damascus' },
  { name: 'Qatar', timezone: 'Asia/Qatar', city: 'Doha' },
  { name: 'Kuwait', timezone: 'Asia/Kuwait', city: 'Kuwait City' },
  { name: 'Nigeria', timezone: 'Africa/Lagos', city: 'Lagos' },
  { name: 'Jordan', timezone: 'Asia/Amman', city: 'Amman' },
  { name: 'Iraq', timezone: 'Asia/Baghdad', city: 'Baghdad' },
  { name: 'Australia', timezone: 'Australia/Sydney', city: 'Sydney' },
  { name: 'Italy', timezone: 'Europe/Rome', city: 'Rome' },
  { name: 'Germany', timezone: 'Europe/Berlin', city: 'Berlin' },
];

export const findCountryBySlug = (slug: string) =>
  COUNTRIES.find((c) => toSlug(c.name) === decodeURIComponent(slug).toLowerCase());

/** "Asia/Kathmandu" -> "GMT+5:45" (current offset, so DST-aware). */
export const gmtOffset = (timezone: string, date = new Date()) => {
  try {
    const part = new Intl.DateTimeFormat('en-US', { timeZone: timezone, timeZoneName: 'shortOffset' })
      .formatToParts(date)
      .find((p) => p.type === 'timeZoneName')?.value;
    return part === 'GMT' ? 'GMT+0' : part ?? '';
  } catch {
    return '';
  }
};
