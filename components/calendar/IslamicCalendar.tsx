"use client";
import { useMemo, useState } from 'react';
import { HIJRI_MONTHS, HIJRI_MONTHS_AR, ISLAMIC_EVENTS, hijriMonthDays } from '@/utils/hijri';

export interface CalendarCountry {
  name: string;
  adjust: number;   // moon-sighting shift vs Umm al-Qura
  todayIso: string; // today's date in that country's time zone
  todayHijri: { year: number; month: number };
}

interface Props {
  countries: CalendarCountry[];
  initialCountry: string;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Monthly Hijri calendar with Gregorian dates, month navigation and a moon-sighting country selector. */
export default function IslamicCalendar({ countries, initialCountry }: Props) {
  const [countryName, setCountryName] = useState(initialCountry);
  const country = countries.find((c) => c.name === countryName) ?? countries[0];
  const [view, setView] = useState(country.todayHijri);

  const days = useMemo(() => hijriMonthDays(view.year, view.month, country.adjust), [view, country.adjust]);
  const events = ISLAMIC_EVENTS.filter((e) => e.month === view.month);
  const eventOn = (day: number) => events.find((e) => e.day === day);

  const shift = (delta: number) =>
    setView(({ year, month }) => {
      const index = year * 12 + (month - 1) + delta;
      return { year: Math.floor(index / 12), month: (index % 12) + 1 };
    });

  const isCurrentMonth = view.year === country.todayHijri.year && view.month === country.todayHijri.month;
  const span = days.length
    ? `${days[0].gregorianMonth} ${days[0].gregorianDay} – ${days.at(-1)!.gregorianMonth} ${days.at(-1)!.gregorianDay}, ${days.at(-1)!.iso.slice(0, 4)}`
    : '';

  return (
    <div className="bg-white dark:bg-[#0A2B20] rounded-[24px] border border-gray-100 dark:border-primary-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.05)] overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-6 md:px-8 py-5 border-b border-gray-100 dark:border-primary-800/50">
        <div className="flex items-center gap-3">
          <button onClick={() => shift(-1)} className="w-10 h-10 rounded-full border border-gray-200 dark:border-primary-800 text-charcoal dark:text-gray-200 hover:border-primary-400 hover:text-primary-700 transition-colors" aria-label="Previous Hijri month">
            <i className="fa-solid fa-chevron-left text-xs"></i>
          </button>
          <div className="min-w-[13rem] text-center">
            <h2 className="text-xl md:text-2xl font-bold text-charcoal dark:text-white leading-tight">
              {HIJRI_MONTHS[view.month - 1]} {view.year} AH
            </h2>
            <p className="text-sm text-softgray dark:text-gray-400">
              <span lang="ar" className="font-arabic text-base">{HIJRI_MONTHS_AR[view.month - 1]}</span> · {span}
            </p>
          </div>
          <button onClick={() => shift(1)} className="w-10 h-10 rounded-full border border-gray-200 dark:border-primary-800 text-charcoal dark:text-gray-200 hover:border-primary-400 hover:text-primary-700 transition-colors" aria-label="Next Hijri month">
            <i className="fa-solid fa-chevron-right text-xs"></i>
          </button>
          {!isCurrentMonth && (
            <button onClick={() => setView(country.todayHijri)} className="ml-1 px-4 py-2 rounded-xl bg-primary-700 dark:bg-primary-600 text-white text-sm font-semibold hover:bg-primary-600 transition-colors">
              Today
            </button>
          )}
        </div>

        <label className="flex items-center gap-3 text-sm text-softgray dark:text-gray-400">
          <span className="whitespace-nowrap"><i className="fa-regular fa-moon mr-1.5 text-primary-500"></i>Moon sighting</span>
          <select
            value={country.name}
            onChange={(e) => {
              const next = countries.find((c) => c.name === e.target.value);
              if (!next) return;
              setCountryName(next.name);
              setView(next.todayHijri);
            }}
            className="rounded-xl border border-gray-200 dark:border-primary-800 bg-white dark:bg-[#061C14] text-charcoal dark:text-white px-3 py-2 focus:outline-none focus:border-primary-400"
          >
            {countries.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}{c.adjust === 0 ? ' (Umm al-Qura)' : ` (${c.adjust > 0 ? '+' : '−'}${Math.abs(c.adjust)} day)`}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Grid */}
      <div className="p-3 md:p-6">
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
          {WEEKDAYS.map((w) => (
            <div key={w} className={`text-center text-[11px] md:text-xs font-bold uppercase tracking-wider py-2 ${w === 'Fri' ? 'text-primary-600 dark:text-primary-400' : 'text-softgray dark:text-gray-500'}`}>
              {w}
            </div>
          ))}
        </div>
        <ol className="grid grid-cols-7 gap-1 md:gap-2" aria-label={`${HIJRI_MONTHS[view.month - 1]} ${view.year} days`}>
          {days.length > 0 && Array.from({ length: days[0].weekday }).map((_, i) => <li key={`blank-${i}`} aria-hidden="true"></li>)}
          {days.map((d) => {
            const isToday = d.iso === country.todayIso;
            const ev = eventOn(d.hijriDay);
            return (
              <li
                key={d.iso}
                title={ev ? `${ev.name} (${ev.note})` : undefined}
                className={`relative min-h-[64px] md:min-h-[88px] rounded-xl md:rounded-2xl border p-1.5 md:p-3 flex flex-col justify-between transition-colors ${
                  isToday
                    ? 'bg-primary-700 dark:bg-primary-600 border-primary-700 text-white'
                    : ev
                      ? 'bg-accent/10 border-accent/40 dark:bg-accent/10'
                      : 'bg-gray-50/60 dark:bg-[#061C14] border-gray-100 dark:border-primary-900/60'
                }`}
              >
                <span className={`text-lg md:text-2xl font-bold leading-none ${isToday ? 'text-white' : 'text-charcoal dark:text-white'}`}>{d.hijriDay}</span>
                <span className={`text-[10px] md:text-xs text-right ${isToday ? 'text-primary-100' : 'text-softgray dark:text-gray-400'}`}>
                  <time dateTime={d.iso}>{d.gregorianDay} {d.gregorianMonth}</time>
                </span>
                {ev && (
                  <span className={`hidden md:block absolute left-3 right-3 top-9 text-[10px] font-semibold leading-tight truncate ${isToday ? 'text-accent-light' : 'text-accent-dark'}`}>
                    {ev.name}
                  </span>
                )}
                {isToday && <span className="sr-only">(today)</span>}
              </li>
            );
          })}
        </ol>

        {events.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2 text-xs">
            {events.map((e) => (
              <li key={e.name} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent-dark border border-accent/30">
                <i className="fa-solid fa-star-and-crescent" aria-hidden="true"></i> {e.note}: {e.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
