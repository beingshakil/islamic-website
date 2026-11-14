import type { Metadata } from 'next';
import Link from '@/components/LocaleLink';
import JsonLd from '@/components/seo/JsonLd';
import FaqList from '@/components/prayer/FaqList';
import IslamicCalendar, { type CalendarCountry } from '@/components/calendar/IslamicCalendar';
import { COUNTRIES } from '@/utils/countries';
import { HIJRI_MONTHS, hijriOf, isoToDate, islamicDate, islamicEventsForYear } from '@/utils/hijri';
import { calendarDescription, calendarFaqs, calendarTitle, hijriYearSpan } from '@/utils/calendarContent';
import { calendarPath, islamicDatePath } from '@/utils/routes';
import { DEFAULT_LOCALE, hasLocale, LOCALES, localizePath } from '@/utils/i18n';
import { pageMetadata } from '@/utils/seo';
import { breadcrumbSchema, faqSchema, graph, webPageSchema } from '@/utils/schema';

// /{lang}/calendar — Islamic (Hijri) calendar. Computed on the server, no API call.
export const revalidate = 300;

// Reference calendar for the page heading and key-dates table.
const BASE_COUNTRY = 'Saudi Arabia';
const BASE_TZ = 'Asia/Riyadh';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const today = islamicDate(BASE_TZ);
  return pageMetadata({
    lang,
    path: calendarPath(),
    title: calendarTitle(today.year),
    description: calendarDescription(today.year, today),
    absoluteTitle: true,
  });
}

export default async function CalendarPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  const L = (p: string) => localizePath(locale, p);

  const today = islamicDate(BASE_TZ);
  const year = today.year;
  const span = hijriYearSpan(year);
  const events = islamicEventsForYear(year, today.isoDate);
  const faqs = calendarFaqs(year, today, today.isoDate);
  const path = L(calendarPath());

  const countries: CalendarCountry[] = COUNTRIES.map((c) => {
    const d = islamicDate(c.timezone, 0);
    const h = hijriOf(isoToDate(d.isoDate), c.hijriAdjust ?? 0);
    return { name: c.name, adjust: c.hijriAdjust ?? 0, todayIso: d.isoDate, todayHijri: { year: h.year, month: h.month } };
  });

  const schema = graph(
    webPageSchema({
      path,
      name: calendarTitle(year),
      description: calendarDescription(year, today),
      inLanguage: LOCALES[locale].hreflang,
      dateModified: today.isoDate,
    }),
    breadcrumbSchema([
      { name: 'Home', path: L('/') },
      { name: 'Islamic Calendar', path },
    ]),
    faqSchema(faqs),
  );

  return (
    <div className="bg-background dark:bg-[#061C14] min-h-screen pb-24 transition-colors duration-300">
      <JsonLd data={schema} />

      {/* 1. HEADER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 text-center">
        <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-sm text-charcoal dark:text-gray-300 mb-5">
          <Link href="/" className="text-gray-400 hover:text-primary-600 transition-colors" aria-label="Home">
            <i className="fa-solid fa-house text-xs"></i>
          </Link>
          <i className="fa-solid fa-chevron-right text-[9px] text-gray-400" aria-hidden="true"></i>
          <span aria-current="page">Islamic Calendar</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-bold text-charcoal dark:text-white tracking-tight leading-tight">
          <span aria-hidden="true" className="mr-3">🌙</span>Islamic Calendar {year} AH
        </h1>
        <p className="mt-4 text-base md:text-lg text-softgray dark:text-gray-400 max-w-2xl mx-auto">
          Hijri calendar for {span.startYear}–{span.endYear} with Gregorian dates for every day, plus Ramadan, Eid and other important Islamic dates.
        </p>

        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm md:text-base bg-white dark:bg-[#0A2B20] border border-gray-100 dark:border-primary-800/50 rounded-full px-6 py-2.5 shadow-sm">
          <span className="font-semibold text-charcoal dark:text-white">Today:</span>
          <span className="font-bold text-primary-700 dark:text-primary-400">{today.hijri} AH</span>
          <span className="text-gray-300" aria-hidden="true">|</span>
          <time dateTime={today.isoDate} className="text-charcoal dark:text-gray-300">{today.weekday}, {today.gregorianLong}</time>
          <span className="text-gray-300" aria-hidden="true">|</span>
          <span lang="ar" dir="rtl" className="font-arabic text-lg text-charcoal/80 dark:text-gray-300">{today.hijriArabic}</span>
        </div>
      </section>

      {/* 2. MONTHLY CALENDAR */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10" aria-label="Hijri month calendar">
        <IslamicCalendar countries={countries} initialCountry={BASE_COUNTRY} />
        <p className="mt-3 text-xs text-softgray dark:text-gray-500 text-center">
          Based on the Umm al-Qura calendar. Islamic months begin with the sighting of the new moon, so dates can differ by a day locally.
          Choose your country under &ldquo;Moon sighting&rdquo; to adjust.
        </p>
      </section>

      {/* 3. KEY DATES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <h2 className="text-2xl md:text-3xl font-bold text-charcoal dark:text-white tracking-tight text-center mb-2">
          Important Islamic Dates {year} AH ({span.startYear}–{span.endYear})
        </h2>
        <p className="text-center text-softgray dark:text-gray-400 mb-8">Ramadan, Eid al-Fitr, Eid al-Adha and other key days with their expected Gregorian dates.</p>

        <div className="overflow-x-auto bg-white dark:bg-[#0A2B20] rounded-2xl border border-gray-100 dark:border-primary-800/50">
          <table className="w-full text-left text-sm md:text-base">
            <thead className="bg-primary-50/60 dark:bg-primary-900/30 text-charcoal dark:text-gray-200">
              <tr>
                <th scope="col" className="px-5 py-4 font-bold">Event</th>
                <th scope="col" className="px-5 py-4 font-bold">Hijri Date</th>
                <th scope="col" className="px-5 py-4 font-bold">Gregorian Date (expected)</th>
                <th scope="col" className="px-5 py-4 font-bold text-right">Days Left</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-primary-800/50">
              {events.map((e) => (
                <tr key={e.name} className={e.daysLeft < 0 ? 'text-softgray dark:text-gray-500' : 'text-charcoal dark:text-gray-200'}>
                  <th scope="row" className="px-5 py-4 font-semibold">{e.name}</th>
                  <td className="px-5 py-4 whitespace-nowrap">{e.hijri}</td>
                  <td className="px-5 py-4 whitespace-nowrap"><time dateTime={e.iso}>{e.gregorian}</time></td>
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    {e.daysLeft > 0 ? <span className="font-bold text-primary-700 dark:text-primary-400">{e.daysLeft} days</span> : e.daysLeft === 0 ? <span className="font-bold text-accent-dark">Today</span> : 'Passed'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. MONTHS OF THE ISLAMIC YEAR */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <h2 className="text-2xl md:text-3xl font-bold text-charcoal dark:text-white tracking-tight text-center mb-8">
          The 12 Months of the Islamic Calendar
        </h2>
        <ol className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {HIJRI_MONTHS.map((m, i) => (
            <li key={m} className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${i + 1 === today.month ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-700' : 'bg-white dark:bg-[#0A2B20] border-gray-100 dark:border-primary-800/50'}`}>
              <span className="w-8 h-8 shrink-0 rounded-lg bg-primary-700 dark:bg-primary-600 text-white text-sm font-bold flex items-center justify-center">{i + 1}</span>
              <span className="font-medium text-charcoal dark:text-white">{m}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* 5. ISLAMIC DATE BY COUNTRY (internal links) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <h2 className="text-2xl md:text-3xl font-bold text-charcoal dark:text-white tracking-tight text-center mb-8">
          Islamic Date Today by Country
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {COUNTRIES.map((c) => {
            const d = islamicDate(c.timezone, c.hijriAdjust);
            return (
              <li key={c.name}>
                <Link
                  href={islamicDatePath(c.name)}
                  className="flex items-center justify-between gap-3 h-full bg-white dark:bg-[#0A2B20] border border-gray-100 dark:border-primary-800/50 rounded-xl px-5 py-4 hover:border-primary-300 dark:hover:border-primary-600 transition-colors group"
                >
                  <span className="font-medium text-charcoal dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-300">Islamic date {c.name}</span>
                  <span className="text-sm text-softgray dark:text-gray-400 shrink-0">{d.day} {d.monthName.split(' ')[0]}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 6. FAQ */}
      <FaqList heading="Islamic Calendar: FAQs" faqs={faqs} />
    </div>
  );
}
