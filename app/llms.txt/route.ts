import { COUNTRIES } from '@/utils/countries';
import { DEFAULT_LOCALE, INDEXED_LOCALES, LOCALES, localizePath } from '@/utils/i18n';
import { INDEXABLE_STATIC_ROUTES } from '@/utils/seo';
import { cityPrayerTimesPath, islamicDatePath, waqtTimePath } from '@/utils/routes';
import { PRAYERS, WAQT_INFO } from '@/utils/prayerContent';
import { DEFAULT_METHOD_LABEL, SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from '@/utils/site';

// /llms.txt — a Markdown guide for LLMs and AI search (https://llmstxt.org).
// Generated from the same data as the sitemap, so it stays in sync automatically.
export const revalidate = 86400;

export function GET() {
  const L = (path: string) => absoluteUrl(localizePath(DEFAULT_LOCALE, path));
  const example = COUNTRIES[0];

  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

${SITE_NAME} publishes today's Islamic prayer (salah / namaz) times for cities worldwide: Fajr, Sunrise, Dhuhr, Asr, Maghrib and Isha, plus each prayer's start and end time. Times are recalculated every day because they follow the position of the sun.

Key facts:
- Default calculation: ${DEFAULT_METHOD_LABEL}. Visitors can switch calculation method (e.g. Muslim World League, Umm Al-Qura, ISNA) and Asr juristic method (Hanafi or Standard).
- A prayer ends one minute before the next period begins: Fajr ends at sunrise, Dhuhr at Asr, Asr at sunset, Maghrib at Isha, Isha at the next Fajr.
- Sehri (suhoor) ends when Fajr begins; Iftar is at Maghrib.
- Languages: ${INDEXED_LOCALES.map((l) => `${LOCALES[l].name} (/${l}/)`).join(', ')}.

URL patterns (replace {country}, {city} with lowercase, hyphenated names):
- All prayer times for a city: ${SITE_URL}/${DEFAULT_LOCALE}/countries/{country}/prayer-times-{city}
  e.g. ${L(cityPrayerTimesPath(example.name, example.city))}
- One prayer for a city ({prayer} = ${PRAYERS.join(', ')}): ${SITE_URL}/${DEFAULT_LOCALE}/countries/{country}/{prayer}-time-{city}
  e.g. ${L(waqtTimePath('fajr', example.name, example.city))}
- Today's Islamic (Hijri / Arabic) date in a country: ${SITE_URL}/${DEFAULT_LOCALE}/calendar/{country}/islamic-date-today
  e.g. ${L(islamicDatePath(example.name))}

## Main pages

${INDEXABLE_STATIC_ROUTES.map((r) => `- [${r.name}](${L(r.path)}): ${r.summary}`).join('\n')}

## Prayer times by country

${COUNTRIES.map((c) => `- [${c.name} – ${c.city} prayer times](${L(cityPrayerTimesPath(c.name, c.city))}): today's ${PRAYERS.map((p) => WAQT_INFO[p].name).join(', ')} times in ${c.city} (${c.timezone}).`).join('\n')}

## Islamic (Hijri) date today by country

The Hijri date follows the Umm al-Qura calendar, shifted for countries that follow local moon sighting (${COUNTRIES.filter((c) => c.hijriAdjust).map((c) => c.name).join(', ')}: usually one day behind Saudi Arabia).

${COUNTRIES.map((c) => `- [Islamic date today in ${c.name}](${L(islamicDatePath(c.name))})`).join('\n')}

## Optional

- [Sitemap](${absoluteUrl('/sitemap.xml')}): every indexable URL, updated daily.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
