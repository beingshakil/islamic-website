"use client";
import Link from '@/components/LocaleLink';
import { findCountryBySlug } from '@/utils/countries';
import { islamicDate } from '@/utils/hijri';
import { islamicDatePath, toSlug } from '@/utils/routes';

/**
 * Today's Hijri date for a country, consistent with /calendar/{country}/islamic-date-today
 * (same moon-sighting adjustment) and linking to it. For countries without a Hijri page,
 * shows `fallback` (e.g. the API's date) as plain text.
 */
export default function HijriDateLink({ country, fallback, className }: { country: string; fallback?: string; className?: string }) {
  const c = findCountryBySlug(toSlug(country || ''));
  if (!c) return <span className={className}>{fallback || '...'}</span>;

  const d = islamicDate(c.timezone, c.hijriAdjust);
  return (
    <Link href={islamicDatePath(c.name)} className={`${className ?? ''} hover:underline`} title={`Islamic date today in ${c.name}`}>
      <span suppressHydrationWarning>{d.hijri}</span>
    </Link>
  );
}
