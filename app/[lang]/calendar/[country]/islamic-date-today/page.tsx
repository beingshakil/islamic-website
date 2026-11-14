import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from '@/components/LocaleLink';
import JsonLd from '@/components/seo/JsonLd';
import FaqList from '@/components/prayer/FaqList';
import { COUNTRIES, findCountryBySlug } from '@/utils/countries';
import { islamicDate } from '@/utils/hijri';
import { MOON_DUA, islamicDateDescription, islamicDateFaqs, islamicDateTitle } from '@/utils/islamicDateContent';
import { calendarPath, cityPrayerTimesPath, islamicDatePath, toSlug } from '@/utils/routes';
import { DEFAULT_LOCALE, hasLocale, LOCALES, localizePath } from '@/utils/i18n';
import { pageMetadata } from '@/utils/seo';
import { breadcrumbSchema, faqSchema, graph, webPageSchema } from '@/utils/schema';

// /{lang}/calendar/{country}/islamic-date-today
// Computed on the server (no API call). Re-rendered every few minutes so the date
// flips soon after midnight in each country's time zone.
export const revalidate = 300;

type Params = Promise<{ lang: string; country: string }>;

export function generateStaticParams() {
  return COUNTRIES.map((c) => ({ country: toSlug(c.name) }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, country } = await params;
  const c = findCountryBySlug(country);
  if (!c) return {};
  const d = islamicDate(c.timezone, c.hijriAdjust);
  return pageMetadata({
    lang,
    path: islamicDatePath(c.name),
    title: islamicDateTitle(c.name),
    description: islamicDateDescription(c.name, d),
    absoluteTitle: true,
  });
}

export default async function IslamicDateTodayPage({ params }: { params: Params }) {
  const { lang, country } = await params;
  const c = findCountryBySlug(country);
  if (!c) notFound();

  const locale = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  const L = (p: string) => localizePath(locale, p);
  const d = islamicDate(c.timezone, c.hijriAdjust);
  const faqs = islamicDateFaqs(c.name, d, c.hijriAdjust ?? 0);
  const path = L(islamicDatePath(c.name));
  const others = COUNTRIES.filter((o) => o.name !== c.name);

  const schema = graph(
    webPageSchema({
      path,
      name: islamicDateTitle(c.name),
      description: islamicDateDescription(c.name, d),
      inLanguage: LOCALES[locale].hreflang,
      dateModified: d.isoDate,
      about: { '@type': 'Country', name: c.name },
    }),
    breadcrumbSchema([
      { name: 'Home', path: L('/') },
      { name: `Islamic Date ${c.name}`, path },
    ]),
    faqSchema(faqs),
  );

  const card = 'rounded-2xl border border-primary-100/70 dark:border-primary-800/50 bg-gradient-to-br from-primary-50/80 via-primary-50/40 to-primary-100/60 dark:from-[#0A2B20] dark:via-[#0A2B20] dark:to-[#0d3527] shadow-[0_4px_20px_rgb(0,0,0,0.03)]';

  return (
    <div className="relative bg-background dark:bg-[#061C14] min-h-screen pb-24 transition-colors duration-300 overflow-hidden">
      <JsonLd data={schema} />

      {/* Decorative lanterns */}
      <div aria-hidden="true" className="hidden md:block pointer-events-none absolute top-0 left-[9%] text-gray-300 dark:text-primary-800">
        <div className="flex gap-6">
          <div className="flex flex-col items-center"><span className="w-px h-10 bg-current"></span><i className="fa-solid fa-star text-[8px] mt-1"></i></div>
          <div className="flex flex-col items-center"><span className="w-px h-16 bg-current"></span><i className="fa-solid fa-mosque text-2xl"></i></div>
          <div className="flex flex-col items-center"><span className="w-px h-6 bg-current"></span><i className="fa-regular fa-moon text-lg"></i></div>
        </div>
      </div>
      <div aria-hidden="true" className="hidden md:block pointer-events-none absolute top-0 right-[9%] text-gray-300 dark:text-primary-800">
        <div className="flex gap-6">
          <div className="flex flex-col items-center"><span className="w-px h-6 bg-current"></span><i className="fa-regular fa-moon text-lg"></i></div>
          <div className="flex flex-col items-center"><span className="w-px h-16 bg-current"></span><i className="fa-solid fa-mosque text-2xl"></i></div>
          <div className="flex flex-col items-center"><span className="w-px h-10 bg-current"></span><i className="fa-solid fa-star text-[8px] mt-1"></i></div>
        </div>
      </div>

      {/* 1. HEADER */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 text-center">
        <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-sm text-charcoal dark:text-gray-300 mb-5">
          <Link href="/" className="text-gray-400 hover:text-primary-600 transition-colors" aria-label="Home">
            <i className="fa-solid fa-house text-xs"></i>
          </Link>
          <i className="fa-solid fa-chevron-right text-[9px] text-gray-400" aria-hidden="true"></i>
          <span aria-current="page">Islamic Date {c.name}</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-bold text-charcoal dark:text-white tracking-tight leading-tight max-w-2xl mx-auto">
          <span aria-hidden="true" className="mr-3">🌙</span>Arabic Date Today in {c.name}
        </h1>

        <p className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-base md:text-lg text-charcoal dark:text-gray-300">
          <span className="uppercase">{c.name}</span>
          <i className="fa-solid fa-location-dot text-primary-500" aria-hidden="true"></i>
          <span className="text-primary-500" aria-hidden="true">|</span>
          <time dateTime={d.isoDate} className="font-medium">{d.gregorianLong}</time>
          <span className="text-gray-400" aria-hidden="true">•</span>
          <span className="font-medium">{d.hijri}</span>
        </p>
      </section>

      {/* 2. DATE CARDS */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${card} p-8 text-center`}>
          <h2 className="flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-wide text-charcoal dark:text-gray-200">
            <i className="fa-solid fa-moon text-primary-600 text-lg" aria-hidden="true"></i>
            Today Hijri Date in {c.name}
          </h2>
          <p className="mt-6 text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 leading-snug">{d.hijri}</p>
          <p lang="ar" dir="rtl" className="mt-3 font-arabic text-xl text-charcoal/80 dark:text-gray-300">{d.hijriArabic}</p>
        </div>

        <div className={`${card} p-8 text-center`}>
          <h2 className="flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-wide text-charcoal dark:text-gray-200">
            <i className="fa-solid fa-sun text-primary-500 text-lg" aria-hidden="true"></i>
            Today&apos;s English Date
          </h2>
          <p className="mt-6 text-3xl md:text-4xl font-bold text-charcoal dark:text-white">
            <time dateTime={d.isoDate}>{d.gregorianShort}</time>
          </p>
          <p className="mt-3 text-base text-softgray dark:text-gray-400">{d.weekday}</p>
        </div>
      </section>

      {/* 3. MOON SIGHTING DUA */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className={`${card} px-6 py-8 md:px-12 text-center`}>
          <h2 className="text-2xl font-bold text-charcoal dark:text-white">
            <span aria-hidden="true" className="mr-2">🌙</span>Moon Sighting Dua
          </h2>
          <p lang="ar" dir="rtl" className="mt-6 font-arabic text-2xl md:text-3xl leading-loose text-charcoal dark:text-gray-100">
            {MOON_DUA.arabic}
          </p>
          <p className="mt-4 text-sm md:text-base italic text-softgray dark:text-gray-400">{MOON_DUA.transliteration}</p>
          <p className="mt-2 text-sm md:text-base text-charcoal/80 dark:text-gray-300">{MOON_DUA.translation}</p>
          <p className="mt-3 text-xs text-softgray dark:text-gray-500">{MOON_DUA.reference}</p>
        </div>
      </section>

      {/* 4. RELATED: prayer times + other countries */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 flex flex-wrap items-center justify-center gap-6">
        <Link
          href={calendarPath()}
          className="inline-flex items-center gap-2 text-primary-700 dark:text-primary-400 font-bold hover:underline"
        >
          <i className="fa-regular fa-calendar-days" aria-hidden="true"></i> Full Islamic Calendar {d.year} AH
        </Link>
        <Link
          href={cityPrayerTimesPath(c.name, c.city)}
          className="inline-flex items-center gap-2 text-primary-700 dark:text-primary-400 font-bold hover:underline"
        >
          <i className="fa-regular fa-clock" aria-hidden="true"></i> Today&apos;s Prayer Times in {c.city}
        </Link>
      </section>

      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <h2 className="text-2xl font-bold text-charcoal dark:text-white tracking-tight text-center mb-8">
          Islamic Date Today in Other Countries
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {others.map((o) => {
            const od = islamicDate(o.timezone, o.hijriAdjust);
            return (
              <li key={o.name}>
                <Link
                  href={islamicDatePath(o.name)}
                  className="flex items-center justify-between gap-3 h-full bg-white dark:bg-[#0A2B20] border border-gray-100 dark:border-primary-800/50 rounded-xl px-5 py-4 hover:border-primary-300 dark:hover:border-primary-600 transition-colors group"
                >
                  <span className="font-medium text-charcoal dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-300">Islamic date {o.name}</span>
                  <span className="text-sm text-softgray dark:text-gray-400 shrink-0">{od.day} {od.monthName.split(' ')[0]}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 5. FAQ */}
      <FaqList heading={`Islamic Date in ${c.name}: FAQs`} faqs={faqs} />
    </div>
  );
}
