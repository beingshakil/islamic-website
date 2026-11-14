"use client";
import { useState, useEffect } from 'react';
import Link, { useLocale } from '@/components/LocaleLink';
import HijriDateLink from '@/components/HijriDateLink';
import { localizePath } from '@/utils/i18n';
import { useRouter } from 'next/navigation';
import SettingsModal from '@/components/SettingsModal';
import PrayerFetchStatus from '@/components/prayer/PrayerFetchStatus';
import FaqList from '@/components/prayer/FaqList';
import { usePrayerTimes } from '@/utils/prayerApi';
import { cityPrayerTimesPath, fromSlug, toSlug, waqtTimePath } from '@/utils/routes';
import { PRAYERS, WAQT_INFO, waqtFaqs, waqtRange } from '@/utils/prayerContent';
import { formatTime } from '@/utils/time';
import { DEFAULT_METHOD } from '@/utils/site';

interface WaqtDetailProps {
  waqt: string;    // slug, e.g. "fajr"
  country: string; // slug, e.g. "bangladesh"
  city: string;    // slug, e.g. "dhaka"
  /** Server-fetched times (default method), so they are in the initial HTML. */
  initialData?: any;
}

const calculationMethods: Record<string, string> = {
  '1': 'University of Islamic Sciences, Karachi',
  '2': 'Islamic Society of North America (ISNA)',
  '3': 'Muslim World League',
  '4': 'Umm Al-Qura University, Makkah',
  '5': 'Egyptian General Authority of Survey',
  '7': 'Institute of Geophysics, University of Tehran',
  '8': 'Gulf Region',
  '9': 'Kuwait',
  '10': 'Qatar',
  '11': 'Majlis Ugama Islam Singapura, Singapore',
  '12': 'Union Organization islamic de France',
  '13': 'Diyanet İşleri Başkanlığı, Turkey',
};

export default function WaqtDetail({ waqt, country, city, initialData }: WaqtDetailProps) {
  const router = useRouter();
  const locale = useLocale();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const info = WAQT_INFO[waqt];
  const waqtName = info?.name ?? fromSlug(waqt);
  const cityName = fromSlug(city);
  const countryName = fromSlug(country);

  const [userSettings, setUserSettings] = useState<any>({
    locationType: 'manual',
    country: countryName,
    city: cityName,
    timeFormat: '12',
    juristicMethod: '1',
    calculationMethod: '1',
    tune: ''
  });
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  const methodName = calculationMethods[userSettings.calculationMethod] || 'Karachi';
  const juristicName = userSettings.juristicMethod === '1' ? 'Hanafi' : 'Standard (Shafi, Maliki, Hambali)';

  // Load calculation preferences; the location always comes from the URL.
  useEffect(() => {
    try {
      const saved = localStorage.getItem('islamic-website-settings');
      if (saved) setUserSettings((prev: any) => ({ ...prev, ...JSON.parse(saved), country: countryName, city: cityName }));
    } catch (e) {
      console.error('Error loading settings:', e);
    } finally {
      setSettingsLoaded(true);
    }
  }, [countryName, cityName]);

  const handleSettingsSave = (newSettings: any) => {
    setUserSettings(newSettings);
    localStorage.setItem('islamic-website-settings', JSON.stringify(newSettings));
    // Location lives in the URL on this page, so a new city means a new page.
    if (newSettings.city && newSettings.country &&
        (toSlug(newSettings.city) !== city || toSlug(newSettings.country) !== country)) {
      router.push(localizePath(locale, waqtTimePath(waqt, newSettings.country, newSettings.city)));
    }
  };

  const { data: prayerData, loading, error, retryIn, retry } = usePrayerTimes(
    settingsLoaded
      ? { city: cityName, country: countryName, school: userSettings.juristicMethod, method: userSettings.calculationMethod, tune: userSettings.tune || '' }
      : null,
    initialData ? { query: { city: cityName, country: countryName, ...DEFAULT_METHOD }, data: initialData } : null
  );

  const { start, end } = waqtRange(waqt, prayerData?.timings, userSettings.timeFormat);
  const faqs = waqtFaqs({ waqt, city: cityName, country: countryName, timings: prayerData?.timings, timeFormat: userSettings.timeFormat });
  const otherPrayers = PRAYERS.filter((p) => p !== waqt);

  return (
    <div className="bg-background dark:bg-[#061C14] min-h-screen pb-20 transition-colors duration-300">
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSettingsSave}
        currentSettings={userSettings}
      />

      {/* 1. TOP HEADER SECTION */}
      <section className="bg-white dark:bg-[#0A2B20] pt-12 pb-20 text-center border-b border-gray-100 dark:border-primary-900 shadow-[0_4px_20px_rgb(0,0,0,0.02)] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-gradient-to-b from-primary-50/50 to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center justify-center gap-2 text-sm text-softgray dark:text-gray-400 font-medium mb-6">
            <Link href="/" className="hover:text-primary-700 dark:hover:text-primary-300 transition-colors">Home</Link>
            <i className="fa-solid fa-chevron-right text-[10px] text-primary-300 dark:text-primary-600" aria-hidden="true"></i>
            <Link href="/countries" className="hover:text-primary-700 dark:hover:text-primary-300 transition-colors">Countries</Link>
            <i className="fa-solid fa-chevron-right text-[10px] text-primary-300 dark:text-primary-600" aria-hidden="true"></i>
            <Link href={cityPrayerTimesPath(countryName, cityName)} className="hover:text-primary-700 dark:hover:text-primary-300 transition-colors">{cityName}</Link>
            <i className="fa-solid fa-chevron-right text-[10px] text-primary-300 dark:text-primary-600" aria-hidden="true"></i>
            <span className="text-charcoal dark:text-white font-bold">{waqtName}</span>
          </nav>

          <div className="w-14 h-14 mx-auto bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-accent mb-6 shadow-sm">
            <i className="fa-regular fa-clock text-2xl"></i>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal dark:text-white mb-4 tracking-tight">
            {waqtName} Time in {cityName} Today
          </h1>
          <p className="text-softgray dark:text-gray-400 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Accurate {waqtName} {info?.isPrayer ? 'namaz start and end time' : 'time'} for {cityName}, {countryName} based on the <span className="text-primary-700 dark:text-primary-400 font-bold">{juristicName}</span> juristic method and <span className="text-primary-700 dark:text-primary-400 font-bold">{methodName}</span> calculation.
          </p>

          <div className="inline-flex flex-wrap items-center justify-center gap-3 text-sm text-softgray dark:text-gray-400 font-semibold bg-gray-50/80 dark:bg-[#061C14]/50 px-6 py-2.5 rounded-full border border-gray-100 dark:border-primary-900">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              title="Change location or calculation method"
            >
              <i className="fa-solid fa-location-dot text-primary-500"></i> {cityName}, {countryName}
              <i className="fa-solid fa-pen-to-square text-[11px]"></i>
            </button>
            <span className="text-gray-300 dark:text-primary-800">|</span>
            <span className="flex items-center gap-2">
              <i className="fa-regular fa-calendar"></i> {prayerData?.readableDate || '...'}
            </span>
            <span className="text-gray-300 dark:text-primary-800">|</span>
            <span className="flex items-center gap-2 text-primary-700 dark:text-primary-400">
              <i className="fa-regular fa-moon"></i> <HijriDateLink country={countryName} fallback={prayerData?.hijriDate} />
            </span>
          </div>
        </div>
      </section>

      {/* 2. MAIN TIME CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white dark:bg-[#0A2B20] rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none border border-gray-100/50 dark:border-primary-800/50 overflow-hidden mb-6">
          <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 dark:border-primary-800/50 bg-white dark:bg-transparent">
            <h2 className="flex items-center gap-3 text-primary-700 dark:text-primary-400 font-bold text-base">
              <span className="w-1.5 h-5 bg-accent rounded-full" aria-hidden="true"></span>
              Today&apos;s {waqtName} Time in {cityName}
            </h2>
            <span suppressHydrationWarning className="text-sm text-softgray dark:text-gray-400 font-semibold bg-gray-50 dark:bg-[#061C14] px-3 py-1 rounded-lg border border-gray-100 dark:border-primary-900">
              {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
            </span>
          </div>

          <PrayerFetchStatus error={error} retryIn={retryIn} onRetry={retry} />

          {!error && retryIn === 0 && (
            <div className={`grid ${info?.isPrayer ? 'grid-cols-2 divide-x' : 'grid-cols-1'} divide-gray-100 dark:divide-primary-800/50 p-8 md:p-12`}>
              <div className="text-center px-4">
                <span className="text-sm font-bold block mb-4 uppercase tracking-widest text-primary-600/70">{info?.isPrayer ? 'Start Time' : 'Time'}</span>
                <span className="text-5xl md:text-6xl font-bold text-primary-700 dark:text-primary-400 tracking-tight">
                  {loading ? '...' : start}
                </span>
                <span className="text-softgray dark:text-gray-500 text-sm block mt-4 font-medium italic">{info?.isPrayer ? `${waqtName} begins` : `${waqtName} in ${cityName}`}</span>
              </div>
              {info?.isPrayer && (
                <div className="text-center px-4">
                  <span className="text-sm font-bold block mb-4 uppercase tracking-widest text-accent">End Time</span>
                  <span className="text-5xl md:text-6xl font-bold text-charcoal dark:text-white tracking-tight">
                    {loading ? '...' : end}
                  </span>
                  <span className="text-softgray dark:text-gray-500 text-sm block mt-4 font-medium italic">Before {info.endsAt === 'Fajr' ? 'next Fajr' : info.endsAt}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Back Links */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link href={cityPrayerTimesPath(countryName, cityName)} className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold hover:underline">
            <i className="fa-regular fa-clock"></i> All Prayer Times in {cityName}
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold hover:underline">
            <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
          </Link>
        </div>
      </section>

      {/* 3. OTHER PRAYERS (internal links) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <h2 className="text-2xl font-bold text-charcoal dark:text-white tracking-tight text-center mb-8">
          Other Prayer Times in {cityName} Today
        </h2>
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {otherPrayers.map((w) => (
            <li key={w}>
              <Link
                href={waqtTimePath(w, countryName, cityName)}
                className="block h-full bg-white dark:bg-[#0A2B20] border border-gray-100 dark:border-primary-800/50 rounded-2xl p-5 text-center hover:border-primary-300 dark:hover:border-primary-600 transition-colors group"
              >
                <span className="block text-sm text-softgray dark:text-gray-400 mb-1">{WAQT_INFO[w].name} time {cityName}</span>
                <span className="block font-bold text-lg text-primary-700 dark:text-primary-400 group-hover:underline">
                  {loading ? '...' : formatTime(prayerData?.timings?.[WAQT_INFO[w].name] ?? '--:--', userSettings.timeFormat)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 4. FAQ */}
      <FaqList heading={`${waqtName} Time in ${cityName}: FAQs`} faqs={faqs} />
    </div>
  );
}
