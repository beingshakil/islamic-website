// Search-intent copy for /calendar (Islamic calendar). Shared by visible page and JSON-LD.
import { gregorianOf, islamicEventsForYear, type DatedEvent, type IslamicDate } from '@/utils/hijri';

/** Gregorian years a Hijri year spans, e.g. 1448 -> [2026, 2027]. */
export const hijriYearSpan = (year: number) => {
  const start = gregorianOf(year, 1, 1);
  const next = gregorianOf(year + 1, 1, 1);
  const end = next ? new Date(next.getTime() - 86_400_000) : null;
  return {
    start,
    end,
    startYear: start?.getUTCFullYear() ?? 0,
    endYear: end?.getUTCFullYear() ?? 0,
  };
};

/** Next occurrence (this Hijri year, or next if already passed) of a named event. */
export const nextEvent = (name: string, year: number, todayIso: string): DatedEvent | undefined =>
  islamicEventsForYear(year, todayIso).find((e) => e.name === name && e.daysLeft >= 0) ??
  islamicEventsForYear(year + 1, todayIso).find((e) => e.name === name);

export const calendarTitle = (year: number) => {
  const s = hijriYearSpan(year);
  return `Islamic Calendar ${year} AH (${s.startYear}–${s.endYear}) – Hijri Calendar Today`;
};

export const calendarDescription = (year: number, today: IslamicDate) => {
  const s = hijriYearSpan(year);
  return `Hijri calendar ${year} AH: today is ${today.hijri}. See Hijri & Gregorian dates for every month, plus Ramadan & Eid dates for ${s.startYear}–${s.endYear}.`;
};

const when = (e?: DatedEvent) => (e ? `${e.gregorian} (${e.hijri} AH)` : 'not available');

export const calendarFaqs = (year: number, today: IslamicDate, todayIso: string) => {
  const s = hijriYearSpan(year);
  const ramadan = nextEvent('First Day of Ramadan', year, todayIso);
  const fitr = nextEvent('Eid al-Fitr', year, todayIso);
  const adha = nextEvent('Eid al-Adha', year, todayIso);
  const fmt = (d: Date | null) => d?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) ?? '';
  return [
    {
      q: 'What is the Islamic date today?',
      a: `Today is ${today.hijri} AH (${today.weekday}, ${today.gregorianLong}) according to the Umm al-Qura calendar. Countries that follow local moon sighting, such as Bangladesh, India and Pakistan, are often one day behind.`,
    },
    {
      q: 'What Islamic year is it now?',
      a: `The current Islamic year is ${year} AH. It began on ${fmt(s.start)} and ends on ${fmt(s.end)}.`,
    },
    {
      q: `When does Ramadan ${ramadan?.iso.slice(0, 4) ?? ''} start?`,
      a: `Ramadan is expected to begin on ${when(ramadan)}, subject to the sighting of the new moon.`,
    },
    {
      q: `When is Eid al-Fitr ${fitr?.iso.slice(0, 4) ?? ''}?`,
      a: `Eid al-Fitr is expected on ${when(fitr)}, the day after Ramadan ends. The exact day depends on moon sighting.`,
    },
    {
      q: `When is Eid al-Adha ${adha?.iso.slice(0, 4) ?? ''}?`,
      a: `Eid al-Adha is expected on ${when(adha)}, the day after the Day of Arafah during Hajj.`,
    },
    {
      q: 'How many days are in an Islamic month?',
      a: 'Each Islamic month has 29 or 30 days, depending on when the new crescent moon is sighted. An Islamic year has 354 or 355 days, about 11 days shorter than the Gregorian year.',
    },
  ];
};
