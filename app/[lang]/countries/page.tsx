import type { Metadata } from 'next';
import CountryGrid, { type CountryCard } from '@/components/countries/CountryGrid';
import JsonLd from '@/components/seo/JsonLd';
import { COUNTRIES, gmtOffset } from '@/utils/countries';
import { cityPrayerTimesPath, countriesPath, countryPath } from '@/utils/routes';
import { DEFAULT_LOCALE, hasLocale, LOCALES, localizePath } from '@/utils/i18n';
import { pageMetadata } from '@/utils/seo';
import { breadcrumbSchema, graph, itemListSchema, webPageSchema } from '@/utils/schema';

// GMT offsets are computed on the server; refresh daily so DST changes show up.
export const revalidate = 86400;

const TITLE = 'Prayer Times by Country – Namaz Timetable';
const DESCRIPTION = `Find accurate prayer times in ${COUNTRIES.length} countries. Pick your country to see today's Fajr, Dhuhr, Asr, Maghrib & Isha namaz times with a live countdown.`;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({ lang, path: countriesPath(), title: TITLE, description: DESCRIPTION });
}

export default async function CountriesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  const L = (p: string) => localizePath(locale, p);

  const now = new Date();
  const countries: CountryCard[] = COUNTRIES.map((c) => ({
    name: c.name,
    href: countryPath(c.name),
    timezone: c.timezone,
    offset: gmtOffset(c.timezone, now),
  }));

  const schema = graph(
    webPageSchema({ path: L(countriesPath()), name: TITLE, description: DESCRIPTION, inLanguage: LOCALES[locale].hreflang, type: 'CollectionPage' }),
    breadcrumbSchema([
      { name: 'Home', path: L('/') },
      { name: 'Prayer Times by Country', path: L(countriesPath()) },
    ]),
    // List the real destination pages (country links redirect to these).
    itemListSchema('Prayer times by country', COUNTRIES.map((c) => ({ name: `Prayer times in ${c.city}, ${c.name}`, path: L(cityPrayerTimesPath(c.name, c.city)) }))),
  );

  return (
    <div className="bg-background dark:bg-[#061C14] min-h-screen transition-colors duration-300">
      <JsonLd data={schema} />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16">
        <CountryGrid countries={countries} />
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="text-2xl font-bold text-charcoal dark:text-white tracking-tight mb-4">
          Accurate Salah Times Wherever You Are
        </h2>
        <div className="space-y-4 text-base text-charcoal dark:text-gray-300 leading-relaxed">
          <p>
            Prayer times depend on the position of the sun, so Fajr, Dhuhr, Asr, Maghrib and Isha begin at different times in every
            city and change a little each day. Choose your country above to open today&apos;s namaz timetable for its main city, then
            switch to your own city from the location button.
          </p>
          <p>
            Each country shows its current time zone and GMT offset, so you can quickly compare azan times across countries when
            travelling or calling family abroad.
          </p>
        </div>
      </section>
    </div>
  );
}
