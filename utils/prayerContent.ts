// Search-intent copy for prayer time pages: titles, meta descriptions, FAQs.
// Shared by server (metadata + JSON-LD) and client (visible text), so what search
// engines read in the schema always matches what visitors see on the page.
import { formatTime } from '@/utils/time';

export type Timings = Record<string, string>;

export const PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;

interface WaqtInfo {
  name: string;
  /** Extra keyword intent for the title, e.g. Sehri/Iftar. */
  titleSuffix: string;
  /** Timing key whose start ends this waqt. */
  endsAt: string;
  fard: number | null;
  isPrayer: boolean;
}

export const WAQT_INFO: Record<string, WaqtInfo> = {
  fajr: { name: 'Fajr', titleSuffix: 'Fajr Namaz & Sehri End Time', endsAt: 'Sunrise', fard: 2, isPrayer: true },
  sunrise: { name: 'Sunrise', titleSuffix: 'Fajr End & Ishraq Time', endsAt: 'Dhuhr', fard: null, isPrayer: false },
  dhuhr: { name: 'Dhuhr', titleSuffix: 'Zuhr Namaz Time', endsAt: 'Asr', fard: 4, isPrayer: true },
  asr: { name: 'Asr', titleSuffix: 'Asr Namaz Time', endsAt: 'Sunset', fard: 4, isPrayer: true },
  sunset: { name: 'Sunset', titleSuffix: 'Sunset & Iftar Time', endsAt: 'Isha', fard: null, isPrayer: false },
  maghrib: { name: 'Maghrib', titleSuffix: 'Maghrib Namaz & Iftar Time', endsAt: 'Isha', fard: 3, isPrayer: true },
  isha: { name: 'Isha', titleSuffix: 'Isha Namaz Time', endsAt: 'Fajr', fard: 4, isPrayer: true },
};

const minusOneMinute = (t?: string) => {
  if (!t || !/^\d{1,2}:\d{2}/.test(t)) return t ?? '--:--';
  const [h, m] = t.split(':').map(Number);
  let total = h * 60 + m - 1;
  if (total < 0) total += 24 * 60;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

/** Start and end (one minute before the next period) of a waqt, formatted. */
export const waqtRange = (waqt: string, timings: Timings | null | undefined, timeFormat = '12') => {
  const info = WAQT_INFO[waqt];
  if (!info || !timings) return { start: '--:--', end: '--:--' };
  return {
    start: formatTime(timings[info.name] ?? '--:--', timeFormat),
    end: info.isPrayer ? formatTime(minusOneMinute(timings[info.endsAt]), timeFormat) : '--:--',
  };
};

const t = (timings: Timings | null | undefined, key: string, fmt = '12') => formatTime(timings?.[key] ?? '--:--', fmt);

// ---------- City page (/countries/{country}/prayer-times-{city}) ----------

export const cityTitle = (city: string) => `${city} Prayer Times Today – Namaz & Azan Time`;

export const cityDescription = (city: string, country: string, timings?: Timings | null) =>
  timings
    ? `Today's prayer times in ${city}, ${country}: Fajr ${t(timings, 'Fajr')}, Dhuhr ${t(timings, 'Dhuhr')}, Asr ${t(timings, 'Asr')}, Maghrib ${t(timings, 'Maghrib')}, Isha ${t(timings, 'Isha')}. See the full namaz schedule now.`
    : `Accurate prayer times in ${city}, ${country} today: Fajr, Dhuhr, Asr, Maghrib & Isha namaz and azan times with Sehri & Iftar. Check today's schedule now.`;

export const cityFaqs = (opts: { city: string; country: string; timings?: Timings | null; methodName: string; juristicName: string; timeFormat?: string }) => {
  const { city, country, timings, methodName, juristicName, timeFormat = '12' } = opts;
  const v = (k: string) => t(timings, k, timeFormat);
  return [
    {
      q: `What are the prayer times in ${city} today?`,
      a: `Today's prayer times in ${city}, ${country} are: Fajr ${v('Fajr')}, Sunrise ${v('Sunrise')}, Dhuhr ${v('Dhuhr')}, Asr ${v('Asr')}, Maghrib ${v('Maghrib')} and Isha ${v('Isha')}.`,
    },
    {
      q: `What time is Fajr in ${city} today?`,
      a: `Fajr in ${city} starts at ${v('Fajr')} and ends at sunrise (${v('Sunrise')}). Sehri (suhoor) should be finished before Fajr begins.`,
    },
    {
      q: `What time is Maghrib (Iftar) in ${city} today?`,
      a: `Maghrib in ${city} begins at ${v('Maghrib')}, right after sunset. This is also the time to break the fast (Iftar) during Ramadan.`,
    },
    {
      q: `What time is Jumu'ah (Friday prayer) in ${city}?`,
      a: `Jumu'ah is prayed in the Dhuhr time, which starts at ${v('Dhuhr')} in ${city} today. Exact congregation times vary by mosque, so check with your local masjid.`,
    },
    {
      q: `How are prayer times in ${city} calculated?`,
      a: `Times are calculated for ${city}, ${country} using the ${methodName} method with the ${juristicName} juristic method for Asr. You can change the method in settings.`,
    },
  ];
};

// ---------- Single prayer page (/countries/{country}/{waqt}-time-{city}) ----------

export const waqtTitle = (waqt: string, city: string) => {
  const info = WAQT_INFO[waqt];
  return `${info.name} Time in ${city} Today – ${info.titleSuffix}`;
};

export const waqtDescription = (waqt: string, city: string, country: string, timings?: Timings | null) => {
  const info = WAQT_INFO[waqt];
  if (!timings) {
    return `Accurate ${info.name} time in ${city}, ${country} today: ${info.name} namaz start and end time. Check today's full prayer schedule now.`;
  }
  const { start, end } = waqtRange(waqt, timings);
  if (!info.isPrayer) return `${info.name} in ${city}, ${country} today is at ${start}. Check today's Fajr, Dhuhr, Asr, Maghrib & Isha times now.`;
  return `${info.name} time in ${city} today starts at ${start} and ends at ${end}. Check accurate ${info.name} namaz times and today's full prayer schedule now.`;
};

export const waqtFaqs = (opts: { waqt: string; city: string; country: string; timings?: Timings | null; timeFormat?: string }) => {
  const { waqt, city, country, timings, timeFormat = '12' } = opts;
  const info = WAQT_INFO[waqt];
  if (!info?.isPrayer) return [];
  const { start, end } = waqtRange(waqt, timings, timeFormat);

  const faqs = [
    {
      q: `When does ${info.name} start in ${city} today?`,
      a: `${info.name} prayer time in ${city}, ${country} starts at ${start} today.`,
    },
    {
      q: `When does ${info.name} end in ${city}?`,
      a: `${info.name} ends at ${end} today, just before ${info.endsAt === 'Fajr' ? 'the next Fajr' : info.endsAt} begins. It is best to pray early in its time.`,
    },
    {
      q: `How many rakats are in ${info.name} prayer?`,
      a: `${info.name} has ${info.fard} fard (obligatory) rakats. Sunnah prayers before or after it vary by school of thought.`,
    },
    {
      q: `Can ${info.name} be prayed after its time ends?`,
      a: `Prayers should be performed within their time. If ${info.name} is missed for a valid reason, it should be made up (qada) as soon as possible.`,
    },
  ];

  if (waqt === 'fajr') {
    faqs.splice(2, 0, { q: `When does Sehri end in ${city} today?`, a: `Sehri (suhoor) in ${city} must end before Fajr begins at ${start}. Many people stop eating a few minutes earlier to be safe.` });
  }
  if (waqt === 'maghrib') {
    faqs.splice(2, 0, { q: `What time is Iftar in ${city} today?`, a: `Iftar in ${city} is at ${start}, when Maghrib begins after sunset.` });
  }
  return faqs;
};
