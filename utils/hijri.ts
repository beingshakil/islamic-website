// Today's Islamic (Hijri) date for a country, computed locally (no API call).
// Base calendar: Umm al-Qura via Intl, evaluated in the country's time zone,
// then shifted by the country's moon-sighting adjustment (see utils/countries.ts).

export const HIJRI_MONTHS = [
  'Muharram', 'Safar', "Rabi al-Awwal", "Rabi al-Thani", 'Jumada al-Awwal', 'Jumada al-Thani',
  'Rajab', "Sha'ban", 'Ramadan', 'Shawwal', "Dhu al-Qadah", 'Dhu al-Hijjah',
];

export interface IslamicDate {
  day: number;
  month: number;      // 1-12
  monthName: string;  // "Jumada al-Thani"
  year: number;       // 1448
  hijri: string;      // "03 Jumada al-Thani 1448"
  hijriArabic: string;// "٣ جمادى الآخرة ١٤٤٨ هـ"
  gregorianLong: string;  // "November 14, 2026"
  gregorianShort: string; // "Nov 14, 2026"
  weekday: string;        // "Saturday"
  isoDate: string;        // "2026-11-14"
}

export function islamicDate(timeZone: string, adjustDays = 0, now = new Date()): IslamicDate {
  const shifted = new Date(now.getTime() + adjustDays * 86_400_000);

  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { timeZone, day: 'numeric', month: 'numeric', year: 'numeric' })
      .formatToParts(shifted)
      .map((p) => [p.type, p.value])
  );
  const day = Number(parts.day);
  const month = Number(parts.month);
  const year = Number(parts.year);
  const monthName = HIJRI_MONTHS[month - 1] ?? '';

  const g = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-US', { timeZone, ...opts }).format(now);
  const iso = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now).map((p) => [p.type, p.value])
  );

  return {
    day,
    month,
    monthName,
    year,
    hijri: `${String(day).padStart(2, '0')} ${monthName} ${year}`,
    hijriArabic: new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { timeZone, day: 'numeric', month: 'long', year: 'numeric' }).format(shifted),
    gregorianLong: g({ month: 'long', day: 'numeric', year: 'numeric' }),
    gregorianShort: g({ month: 'short', day: 'numeric', year: 'numeric' }),
    weekday: g({ weekday: 'long' }),
    isoDate: `${iso.year}-${iso.month}-${iso.day}`,
  };
}

// ---------------------------------------------------------------------------
// Calendar helpers (Hijri <-> Gregorian), date-only, evaluated at 12:00 UTC.
// ---------------------------------------------------------------------------

export const HIJRI_MONTHS_AR = [
  'مُحَرَّم', 'صَفَر', 'رَبِيع الأَوَّل', 'رَبِيع الآخِر', 'جُمَادَى الأُولَى', 'جُمَادَى الآخِرَة',
  'رَجَب', 'شَعْبَان', 'رَمَضَان', 'شَوَّال', 'ذُو القَعْدَة', 'ذُو الحِجَّة',
];

const DAY_MS = 86_400_000;
const hijriFmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { timeZone: 'UTC', day: 'numeric', month: 'numeric', year: 'numeric' });

/** Noon-UTC Date for an ISO day ("2026-11-14"). */
export const isoToDate = (iso: string) => new Date(`${iso}T12:00:00Z`);
export const dateToIso = (d: Date) => d.toISOString().slice(0, 10);

/** Hijri parts of a Gregorian day, shifted by a moon-sighting adjustment. */
export function hijriOf(date: Date, adjustDays = 0) {
  const parts = Object.fromEntries(hijriFmt.formatToParts(new Date(date.getTime() + adjustDays * DAY_MS)).map((p) => [p.type, p.value]));
  return { day: Number(parts.day), month: Number(parts.month), year: Number(parts.year) };
}

/** Gregorian date (noon UTC) of a Hijri day, or null if out of range. */
export function gregorianOf(year: number, month: number, day: number, adjustDays = 0): Date | null {
  // Rough estimate from the Hijri epoch, then scan to the exact day.
  const approx = Date.UTC(622, 6, 19, 12) + ((year - 1) * 354.367 + (month - 1) * 29.5306 + (day - 1)) * DAY_MS;
  for (let offset = -6; offset <= 6; offset++) {
    const d = new Date(approx + offset * DAY_MS);
    const h = hijriOf(d, adjustDays);
    if (h.year === year && h.month === month && h.day === day) return d;
  }
  return null;
}

export interface CalendarDay {
  hijriDay: number;
  iso: string;          // Gregorian ISO date
  gregorianDay: number;
  gregorianMonth: string; // "Nov"
  weekday: number;      // 0 = Sunday
}

/** Every day of a Hijri month with its Gregorian date. */
export function hijriMonthDays(year: number, month: number, adjustDays = 0): CalendarDay[] {
  const first = gregorianOf(year, month, 1, adjustDays);
  if (!first) return [];
  const days: CalendarDay[] = [];
  for (let i = 0; i < 31; i++) {
    const d = new Date(first.getTime() + i * DAY_MS);
    const h = hijriOf(d, adjustDays);
    if (h.month !== month) break;
    days.push({
      hijriDay: h.day,
      iso: dateToIso(d),
      gregorianDay: d.getUTCDate(),
      gregorianMonth: d.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }),
      weekday: d.getUTCDay(),
    });
  }
  return days;
}

/** Key dates of the Islamic year (commonly observed; exact days follow local moon sighting). */
export const ISLAMIC_EVENTS = [
  { month: 1, day: 1, name: 'Islamic New Year', note: '1 Muharram' },
  { month: 1, day: 10, name: 'Day of Ashura', note: '10 Muharram' },
  { month: 3, day: 12, name: 'Mawlid an-Nabi', note: '12 Rabi al-Awwal' },
  { month: 7, day: 27, name: "Isra and Mi'raj", note: '27 Rajab' },
  { month: 8, day: 15, name: "Shab-e-Barat (Mid-Sha'ban)", note: "15 Sha'ban" },
  { month: 9, day: 1, name: 'First Day of Ramadan', note: '1 Ramadan' },
  { month: 9, day: 27, name: 'Laylat al-Qadr (expected)', note: '27 Ramadan' },
  { month: 10, day: 1, name: 'Eid al-Fitr', note: '1 Shawwal' },
  { month: 12, day: 9, name: 'Day of Arafah', note: '9 Dhu al-Hijjah' },
  { month: 12, day: 10, name: 'Eid al-Adha', note: '10 Dhu al-Hijjah' },
] as const;

export interface DatedEvent {
  name: string;
  note: string;
  hijri: string;   // "1 Ramadan 1448"
  iso: string;
  gregorian: string; // "Monday, February 8, 2027"
  daysLeft: number;  // negative = passed
}

/** ISLAMIC_EVENTS for a Hijri year with Gregorian dates and days left from `todayIso`. */
export function islamicEventsForYear(year: number, todayIso: string, adjustDays = 0): DatedEvent[] {
  const today = isoToDate(todayIso).getTime();
  return ISLAMIC_EVENTS.flatMap((e) => {
    const g = gregorianOf(year, e.month, e.day, adjustDays);
    if (!g) return [];
    return [{
      name: e.name,
      note: e.note,
      hijri: `${e.day} ${HIJRI_MONTHS[e.month - 1]} ${year}`,
      iso: dateToIso(g),
      gregorian: g.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
      daysLeft: Math.round((g.getTime() - today) / DAY_MS),
    }];
  });
}
