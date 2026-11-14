// Search-intent copy for /calendar/{country}/islamic-date-today.
// Used for both the visible page and its JSON-LD so they always match.
import type { IslamicDate } from '@/utils/hijri';

export const MOON_DUA = {
  arabic: 'اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْيُمْنِ وَالْإِيمَانِ وَالسَّلَامَةِ وَالْإِسْلَامِ رَبِّي وَرَبُّكَ اللَّهُ',
  transliteration: "Allahumma ahillahu 'alayna bil-yumni wal-iman, was-salamati wal-Islam. Rabbi wa Rabbuk-Allah.",
  translation: 'O Allah, bring it over us with blessing and faith, and security and Islam. My Lord and your Lord is Allah.',
  reference: "Jami' at-Tirmidhi 3451",
};

export const islamicDateTitle = (country: string) => `Islamic Date Today in ${country} – Arabic (Hijri) Date`;

export const islamicDateDescription = (country: string, d: IslamicDate) =>
  `Today's Islamic date in ${country} is ${d.hijri} AH (${d.gregorianLong}). See the Arabic (Hijri) date today and the moon sighting dua.`;

export const islamicDateFaqs = (country: string, d: IslamicDate, adjust: number) => [
  {
    q: `What is the Islamic date today in ${country}?`,
    a: `Today's Islamic (Hijri) date in ${country} is ${d.hijri} AH, which is ${d.weekday}, ${d.gregorianLong} in the Gregorian calendar.`,
  },
  {
    q: `What is today's Arabic date in Arabic script?`,
    a: `Written in Arabic, today's Hijri date in ${country} is ${d.hijriArabic}.`,
  },
  adjust !== 0
    ? {
        q: `Why is the Islamic date in ${country} different from Saudi Arabia?`,
        a: `Islamic months begin with the sighting of the new moon. ${country} follows local moon sighting, so its Hijri date is often ${Math.abs(adjust)} day${Math.abs(adjust) > 1 ? 's' : ''} behind Saudi Arabia's Umm al-Qura calendar.`,
      }
    : {
        q: `How is the Islamic date in ${country} calculated?`,
        a: `This date follows the Umm al-Qura calendar used in Saudi Arabia. The official start of months such as Ramadan can differ by a day depending on local moon sighting announcements in ${country}.`,
      },
  {
    q: 'When does the Islamic day begin?',
    a: `An Islamic day begins at sunset (Maghrib), so the Hijri date changes in the evening. This page shows the Hijri date for the daytime of ${d.gregorianLong}.`,
  },
  {
    q: 'What dua is recited when sighting the new moon?',
    a: `When seeing the new crescent moon, the Prophet ﷺ said: "${MOON_DUA.transliteration}" — "${MOON_DUA.translation}" (${MOON_DUA.reference}).`,
  },
];
