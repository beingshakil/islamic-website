"use client";
import { useMemo, useState } from 'react';
import Link from '@/components/LocaleLink';

export interface CountryCard {
  name: string;
  href: string;     // un-prefixed path; Link adds the language
  timezone: string; // "Asia/Dhaka"
  offset: string;   // "GMT+6"
}

const PAGE_SIZE = 20;

export default function CountryGrid({ countries }: { countries: CountryCard[] }) {
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const q = query.trim().toLowerCase();
  const matches = useMemo(
    () => (q ? countries.filter((c) => c.name.toLowerCase().includes(q) || c.timezone.toLowerCase().includes(q)) : countries),
    [countries, q]
  );
  // While searching, show every match; otherwise page through the list.
  const shown = q ? matches : matches.slice(0, visible);
  const hasMore = !q && visible < matches.length;

  return (
    <>
      {/* Header: title left, search right */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal dark:text-white tracking-tight mb-4">
            Worldwide Islamic Prayer Times
          </h1>
          <p className="text-softgray dark:text-gray-400 text-base md:text-lg">
            Find your country and get the daily prayer times instantly
          </p>
        </div>

        <label className="relative w-full md:w-80 shrink-0 md:mt-2">
          <span className="sr-only">Search Country</span>
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-sm text-softgray dark:text-gray-500 pointer-events-none"></i>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Country"
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white dark:bg-[#0A2B20] border border-gray-200 dark:border-primary-800 text-sm text-charcoal dark:text-white placeholder:text-softgray dark:placeholder:text-gray-500 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900 transition-all"
          />
        </label>
      </div>

      {/* Country cards */}
      {shown.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {shown.map((c) => (
            <li key={c.href}>
              <Link
                href={c.href}
                className="flex items-center gap-5 h-full bg-white dark:bg-[#0A2B20] border border-gray-100 dark:border-primary-800/50 rounded-xl px-7 py-5 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-none transition-all group"
              >
                <span className="relative shrink-0 text-2xl text-primary-200 dark:text-primary-700 group-hover:text-primary-300 dark:group-hover:text-primary-600 transition-colors" aria-hidden="true">
                  <i className="fa-solid fa-location-pin"></i>
                  <span className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary-700 dark:bg-primary-300"></span>
                </span>
                <span className="min-w-0">
                  <span className="block text-base font-medium text-charcoal dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors truncate">
                    {c.name}
                  </span>
                  <span className="block text-sm text-softgray dark:text-gray-400 mt-0.5 truncate">
                    {c.offset}{c.offset && ', '}{c.timezone}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-softgray dark:text-gray-400 py-16">
          No country found for &ldquo;{query}&rdquo;.
        </p>
      )}

      {hasMore && (
        <div className="text-center mt-14">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="px-8 py-3.5 rounded-xl bg-primary-700 dark:bg-primary-600 text-white font-semibold hover:bg-primary-600 dark:hover:bg-primary-500 shadow-[0_4px_20px_rgba(15,61,46,0.2)] dark:shadow-none transition-all"
          >
            Show More
          </button>
        </div>
      )}
    </>
  );
}
