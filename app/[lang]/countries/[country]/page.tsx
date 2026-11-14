import { notFound, redirect } from 'next/navigation';
import { findCountryBySlug } from '@/utils/countries';
import { cityPrayerTimesPath } from '@/utils/routes';
import { DEFAULT_LOCALE, hasLocale, localizePath } from '@/utils/i18n';

// /{lang}/countries/{country}
// No dedicated country page yet: send visitors to the country's default city.
// Temporary (307) redirect, so a real country page can replace this later without SEO baggage.
export default async function CountryPage({ params }: { params: Promise<{ lang: string; country: string }> }) {
  const { lang, country } = await params;
  const match = findCountryBySlug(country);
  if (!match) notFound();

  const locale = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  redirect(localizePath(locale, cityPrayerTimesPath(match.name, match.city)));
}
