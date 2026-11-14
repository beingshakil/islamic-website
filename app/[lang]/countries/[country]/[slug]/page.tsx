import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CityPrayerTimes from '@/components/prayer/CityPrayerTimes';
import WaqtDetail from '@/components/prayer/WaqtDetail';
import JsonLd from '@/components/seo/JsonLd';
import { cityPrayerTimesPath, countriesPath, fromSlug, parseLocationSlug, waqtTimePath } from '@/utils/routes';
import { DEFAULT_LOCALE, hasLocale, LOCALES, localizePath } from '@/utils/i18n';
import { pageMetadata } from '@/utils/seo';
import { getPrayerTimes } from '@/utils/prayerServer';
import { cityDescription, cityFaqs, cityTitle, WAQT_INFO, waqtDescription, waqtFaqs, waqtTitle } from '@/utils/prayerContent';
import { breadcrumbSchema, cityPlaceSchema, faqSchema, graph, webPageSchema } from '@/utils/schema';
import { DEFAULT_METHOD_LABEL } from '@/utils/site';

// Handles:
//   /en/countries/bangladesh/prayer-times-dhaka  -> all prayer times for Dhaka
//   /en/countries/bangladesh/fajr-time-dhaka     -> Fajr time for Dhaka

type Params = Promise<{ lang: string; country: string; slug: string }>;

// Prayer times change daily; re-render at most hourly (matches the data cache).
export const revalidate = 3600;

const resolve = async (params: Params) => {
  const { lang, country, slug } = await params;
  const route = parseLocationSlug(slug);
  if (!route) return null;
  const locale = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  const countryName = fromSlug(country);
  const cityName = fromSlug(route.citySlug);
  return { locale, country, route, countryName, cityName };
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const r = await resolve(params);
  if (!r) return {};
  const { locale, route, countryName, cityName } = r;
  // Same request as the page below; Next.js de-duplicates it.
  const data = await getPrayerTimes(cityName, countryName);

  if (route.kind === 'city') {
    return pageMetadata({
      lang: locale,
      path: cityPrayerTimesPath(countryName, cityName),
      title: cityTitle(cityName),
      description: cityDescription(cityName, countryName, data?.timings),
    });
  }

  return pageMetadata({
    lang: locale,
    path: waqtTimePath(route.waqt, countryName, cityName),
    title: waqtTitle(route.waqt, cityName),
    // Keyword-first title is already ~55 chars; a brand suffix would get truncated in results.
    absoluteTitle: true,
    description: waqtDescription(route.waqt, cityName, countryName, data?.timings),
    // Sunrise/Sunset are not prayers: thin pages, keep them out of the index.
    index: WAQT_INFO[route.waqt].isPrayer,
  });
}

export default async function CountryLocationPage({ params }: { params: Params }) {
  const r = await resolve(params);
  if (!r) notFound();
  const { locale, country, route, countryName, cityName } = r;
  const data = await getPrayerTimes(cityName, countryName);
  const inLanguage = LOCALES[locale].hreflang;
  const L = (p: string) => localizePath(locale, p);
  const cityPath = L(cityPrayerTimesPath(countryName, cityName));

  if (route.kind === 'city') {
    const description = cityDescription(cityName, countryName, data?.timings);
    const schema = graph(
      webPageSchema({ path: cityPath, name: cityTitle(cityName), description, inLanguage, about: cityPlaceSchema(cityName, countryName) }),
      breadcrumbSchema([
        { name: 'Home', path: L('/') },
        { name: 'Prayer Times by Country', path: L(countriesPath()) },
        { name: `${cityName} Prayer Times`, path: cityPath },
      ]),
      faqSchema(cityFaqs({ city: cityName, country: countryName, timings: data?.timings, methodName: DEFAULT_METHOD_LABEL, juristicName: 'Hanafi' })),
    );
    return (
      <>
        <JsonLd data={schema} />
        <CityPrayerTimes country={country} city={route.citySlug} initialData={data} />
      </>
    );
  }

  const info = WAQT_INFO[route.waqt];
  const waqtPath = L(waqtTimePath(route.waqt, countryName, cityName));
  const faqs = waqtFaqs({ waqt: route.waqt, city: cityName, country: countryName, timings: data?.timings });
  const schema = graph(
    webPageSchema({
      path: waqtPath,
      name: waqtTitle(route.waqt, cityName),
      description: waqtDescription(route.waqt, cityName, countryName, data?.timings),
      inLanguage,
      about: cityPlaceSchema(cityName, countryName),
    }),
    breadcrumbSchema([
      { name: 'Home', path: L('/') },
      { name: 'Prayer Times by Country', path: L(countriesPath()) },
      { name: `${cityName} Prayer Times`, path: cityPath },
      { name: `${info.name} Time`, path: waqtPath },
    ]),
    ...(faqs.length ? [faqSchema(faqs)] : []),
  );

  return (
    <>
      <JsonLd data={schema} />
      <WaqtDetail waqt={route.waqt} country={country} city={route.citySlug} initialData={data} />
    </>
  );
}
