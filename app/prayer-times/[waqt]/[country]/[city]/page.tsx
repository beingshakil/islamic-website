"use client";
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import SettingsModal from '@/components/SettingsModal';

export default function WaqtDetailPage({ params }: { params: Promise<{ waqt: string, country: string, city: string }> }) {
  const { waqt, country, city } = use(params);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [prayerData, setPrayerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
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

  const [userSettings, setUserSettings] = useState<any>({
    locationType: 'auto',
    country: 'Bangladesh',
    city: 'Dhaka',
    timeFormat: '12',
    juristicMethod: '1',
    calculationMethod: '1',
    tune: ''
  });
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  const waqtName = waqt.charAt(0).toUpperCase() + waqt.slice(1);
  const cityName = city.charAt(0).toUpperCase() + city.slice(1).replace(/-/g, ' ');
  const countryName = country.charAt(0).toUpperCase() + country.slice(1).replace(/-/g, ' ');
  const methodName = calculationMethods[userSettings.calculationMethod] || 'Karachi';
  const juristicName = userSettings.juristicMethod === '1' ? 'Hanafi' : 'Standard (Shafi, Maliki, Hambali)';

  const [error, setError] = useState<string | null>(null);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('islamic-website-settings');
      if (savedSettings) {
        setUserSettings(JSON.parse(savedSettings));
      }
    } catch (e) {
      console.error('Error loading settings:', e);
    } finally {
      setSettingsLoaded(true);
    }
  }, []);

  const handleSettingsSave = (newSettings: any) => {
    setUserSettings(newSettings);
    localStorage.setItem('islamic-website-settings', JSON.stringify(newSettings));
  };

  useEffect(() => {
    if (!settingsLoaded) return;
    
    let isMounted = true;
    const fetchPrayerTimes = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        // Clean city/country names
        const cleanCity = city.replace(/-/g, ' ');
        const cleanCountry = country.replace(/-/g, ' ');

        const query = `city=${encodeURIComponent(cleanCity)}&country=${encodeURIComponent(cleanCountry)}&school=${userSettings.juristicMethod}&method=${userSettings.calculationMethod}&tune=${userSettings.tune || ''}`;
        const res = await fetch(`${apiUrl}/prayer-times?${query}`);
        
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        
        const json = await res.json();
        if (isMounted) {
          if (!json || !json.timings) throw new Error('Invalid data received from server');
          setPrayerData(json);
        }
      } catch (err: any) {
        console.error('Error fetching prayer times:', err);
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPrayerTimes();
    return () => { isMounted = false; };
  }, [city, country, settingsLoaded, userSettings.juristicMethod, userSettings.calculationMethod, userSettings.tune]);

  const formatTime = (timeStr: string) => {
    if (!timeStr || timeStr === '--:--') return timeStr;
    if (userSettings.timeFormat === '24') return timeStr;
    
    const [hours, minutes] = timeStr.split(':');
    let h = parseInt(hours);
    const m = minutes;
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${m} ${ampm}`;
  };

  const subtractOneMinute = (timeStr: string) => {
    if (!timeStr || timeStr === '--:--') return timeStr;
    const [h, m] = timeStr.split(':').map(Number);
    let totalMinutes = h * 60 + m - 1;
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    const newH = Math.floor(totalMinutes / 60);
    const newM = totalMinutes % 60;
    return `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
  };

  const getWaqtRange = () => {
    if (!prayerData) return { start: '--:--', end: '--:--' };
    const timings = prayerData.timings;
    
    const start = timings[waqtName];
    let endRaw = '--:--';
    
    if (waqtName === 'Fajr') endRaw = timings['Sunrise'];
    else if (waqtName === 'Dhuhr') endRaw = timings['Asr'];
    else if (waqtName === 'Asr') endRaw = timings['Sunset'];
    else if (waqtName === 'Maghrib') endRaw = timings['Isha'];
    else if (waqtName === 'Isha') endRaw = timings['Fajr']; 
    
    return { 
      start: formatTime(start), 
      end: formatTime(subtractOneMinute(endRaw)) 
    };
  };

  const { start, end } = getWaqtRange();

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
          <div className="w-14 h-14 mx-auto bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-accent mb-6 shadow-sm">
            <i className="fa-regular fa-clock text-2xl"></i>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal dark:text-white mb-4 tracking-tight">
            {waqtName} Prayer Time in {cityName}
          </h1>
          <p className="text-softgray dark:text-gray-400 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Accurate {waqtName} prayer timings for {cityName}, {countryName} based on <span className="text-primary-700 dark:text-primary-400 font-bold">{juristicName}</span> juristic method and <span className="text-primary-700 dark:text-primary-400 font-bold">{methodName}</span> calculation.
          </p>
          
          <div className="inline-flex flex-wrap items-center justify-center gap-3 text-sm text-softgray dark:text-gray-400 font-semibold bg-gray-50/80 dark:bg-[#061C14]/50 px-6 py-2.5 rounded-full border border-gray-100 dark:border-primary-900">
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-location-dot text-primary-500"></i> {cityName}, {countryName}
            </span>
            <span className="text-gray-300 dark:text-primary-800">|</span>
            <span className="flex items-center gap-2">
              <i className="fa-regular fa-calendar"></i> {prayerData?.readableDate || '...'}
            </span>
            <span className="text-gray-300 dark:text-primary-800">|</span>
            <span className="flex items-center gap-2 text-primary-700 dark:text-primary-400">
              <i className="fa-regular fa-moon"></i> {prayerData?.hijriDate || '...'}
            </span>
          </div>
        </div>
      </section>

      {/* 2. MAIN TIME CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white dark:bg-[#0A2B20] rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none border border-gray-100/50 dark:border-primary-800/50 overflow-hidden mb-6">
          <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 dark:border-primary-800/50 bg-white dark:bg-transparent">
            <div className="flex items-center gap-3 text-primary-700 dark:text-primary-400 font-bold text-base">
              <div className="w-1.5 h-5 bg-accent rounded-full"></div>
              Today's {waqtName} Time
            </div>
            <span className="text-sm text-softgray dark:text-gray-400 font-semibold bg-gray-50 dark:bg-[#061C14] px-3 py-1 rounded-lg border border-gray-100 dark:border-primary-900">
              {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
            </span>
          </div>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-8 text-center">
              <i className="fa-solid fa-triangle-exclamation text-red-500 text-3xl mb-4"></i>
              <p className="text-red-700 dark:text-red-400 font-bold mb-2">Failed to load prayer times</p>
              <p className="text-red-600 dark:text-red-500 text-sm mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
          
          {!error && (
            <div className="grid grid-cols-2 divide-x divide-gray-100 dark:divide-primary-800/50 p-8 md:p-12">
              <div className="text-center px-4">
                <span className="text-softgray dark:text-gray-500 text-sm font-bold block mb-4 uppercase tracking-widest text-primary-600/70">Start Time</span>
                <span className="text-5xl md:text-6xl font-bold text-primary-700 dark:text-primary-400 tracking-tight">
                  {loading ? '...' : start}
                </span>
                <span className="text-softgray dark:text-gray-500 text-sm block mt-4 font-medium italic">Exact {waqtName} entrance</span>
              </div>
              <div className="text-center px-4">
                <span className="text-softgray dark:text-gray-500 text-sm font-bold block mb-4 uppercase tracking-widest text-accent">End Time</span>
                <span className="text-5xl md:text-6xl font-bold text-charcoal dark:text-white tracking-tight">
                  {loading ? '...' : end}
                </span>
                <span className="text-softgray dark:text-gray-500 text-sm block mt-4 font-medium italic">Before next prayer</span>
              </div>
            </div>
          )}
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold hover:underline">
            <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
