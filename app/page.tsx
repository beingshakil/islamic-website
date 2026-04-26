"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import SettingsModal from '@/components/SettingsModal';

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [prayerData, setPrayerData] = useState<any>(null);
  const [hadithData, setHadithData] = useState<any>(null);
  const [duaData, setDuaData] = useState<any>(null);
  const [loadingPrayer, setLoadingPrayer] = useState(true);
  const [loadingDaily, setLoadingDaily] = useState(true);
  const [currentDate, setCurrentDate] = useState({ gregorian: '', hijri: '' });
  const [timer, setTimer] = useState({ current: '', next: '', remaining: '', nextTime: '', isGap: false });
  const [gpsLocation, setGpsLocation] = useState<string | null>(null);
  const [prayerCache, setPrayerCache] = useState<Record<string, any>>({});
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

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('islamic-website-settings');
    if (savedSettings) {
      setUserSettings(JSON.parse(savedSettings));
    }
    setSettingsLoaded(true);
  }, []);

  const handleSettingsSave = (newSettings: any) => {
    setUserSettings(newSettings);
    localStorage.setItem('islamic-website-settings', JSON.stringify(newSettings));
    // Data will re-fetch due to the dependency in the next useEffect
  };

  // 1. Prayer Logic Calculation
  useEffect(() => {
    if (!prayerData) return;

    const updateTimer = () => {
      const now = new Date();
      const timings = prayerData.timings;
      
      // Order of prayers
      const prayerNames = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Sunset', 'Maghrib', 'Isha'];
      const prayerTimes: { name: string; time: Date }[] = [];

      // Parse today's times
      prayerNames.forEach(name => {
        const timeStr = timings[name];
        if (!timeStr) return; // Skip if timing is missing

        const [hours, minutes] = timeStr.split(':');
        const prayerDate = new Date(now);
        prayerDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        prayerTimes.push({ name, time: prayerDate });
      });

      // Find current and next prayer
      let currentIdx = -1;
      let nextIdx = 0;

      for (let i = 0; i < prayerTimes.length; i++) {
        if (now >= prayerTimes[i].time) {
          currentIdx = i;
        } else {
          nextIdx = i;
          break;
        }
      }

      // If it's after Isha, next is Fajr tomorrow
      let nextPrayer = prayerTimes[nextIdx];
      if (now >= prayerTimes[prayerTimes.length - 1].time) {
        currentIdx = 5; // Isha
        nextIdx = 0; // Fajr
        const tomorrowFajr = new Date(prayerTimes[0].time);
        tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
        nextPrayer = { name: 'Fajr', time: tomorrowFajr };
      }

      const diff = nextPrayer.time.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const formattedRemaining = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      
      const isNonPrayer = ['Sunrise', 'Sunset'].includes(prayerNames[currentIdx]);

      setTimer({
        current: prayerNames[currentIdx] || 'Isha',
        next: nextPrayer.name,
        remaining: formattedRemaining,
        nextTime: formatTime(nextPrayer.time.getHours().toString().padStart(2, '0') + ':' + nextPrayer.time.getMinutes().toString().padStart(2, '0')),
        isGap: isNonPrayer
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [prayerData]);

  useEffect(() => {
    // 1. Calculate automatic dates
    const today = new Date();
    const gregFormatter = new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    const hijriFormatter = new Intl.DateTimeFormat('en-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    setCurrentDate({
      gregorian: gregFormatter.format(today),
      hijri: hijriFormatter.format(today) + ' AH'
    });
  }, []);

  useEffect(() => {
    if (!settingsLoaded) return;
    
    // 2. Fetch Prayer Times (Depends on settings)
    const fetchPrayerTimes = async () => {
      let prayerQuery = `city=${userSettings.city}&country=${userSettings.country}&school=${userSettings.juristicMethod}&method=${userSettings.calculationMethod}&tune=${userSettings.tune || ''}`;
      
      // Check cache first
      if (prayerCache[prayerQuery]) {
        setPrayerData(prayerCache[prayerQuery]);
        setLoadingPrayer(false);
        return;
      }

      setLoadingPrayer(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        let usedGps = false;

        if (userSettings.locationType === 'auto' && "geolocation" in navigator) {
          try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
            });
            prayerQuery = `latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&school=${userSettings.juristicMethod}&method=${userSettings.calculationMethod}&tune=${userSettings.tune || ''}`;
            
            // Check cache again with GPS query
            if (prayerCache[prayerQuery]) {
              setPrayerData(prayerCache[prayerQuery]);
              setLoadingPrayer(false);
              return;
            }
            
            usedGps = true;
          } catch (geoError: any) {
            console.warn('Geolocation failed or denied:', geoError);
            if (geoError.code === 1) setGpsLocation('Location permission denied');
            else setGpsLocation('Detection failed (using fallback)');
          }
        }

        const res = await fetch(`${apiUrl}/prayer-times?${prayerQuery}`);
        if (!res.ok) throw new Error('Prayer times fetch failed');
        const json = await res.json();
        
        // Update state and cache
        setPrayerData(json);
        setPrayerCache(prev => ({ ...prev, [prayerQuery]: json }));
        
        if (usedGps && json.city) setGpsLocation(`${json.city}, ${json.country || 'Bangladesh'}`);
      } catch (error) {
        console.error('Error fetching prayer times:', error);
      } finally {
        setLoadingPrayer(false);
      }
    };

    // 3. Fetch Daily Content (Hadith/Dua - once a day)
    const fetchDailyContent = async () => {
      if (hadithData && duaData) return; // Only fetch once
      setLoadingDaily(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const [hadithRes, duaRes] = await Promise.all([
          fetch(`${apiUrl}/hadith-of-the-day`),
          fetch(`${apiUrl}/dua-of-the-day`)
        ]);
        if (hadithRes.ok) setHadithData(await hadithRes.json());
        if (duaRes.ok) setDuaData(await duaRes.json());
      } catch (error) {
        console.error('Error fetching daily content:', error);
      } finally {
        setLoadingDaily(false);
      }
    };

    fetchPrayerTimes();
    fetchDailyContent();
  }, [userSettings]);

  return (
    <>
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onSave={handleSettingsSave}
        currentSettings={userSettings}
        detectedLocation={gpsLocation || undefined}
      />
      
      {/* 1. HERO SECTION - PRAYER TIMES */}
      <section id="prayer" className="relative py-12 lg:py-16">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs + Dates Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-center text-center sm:text-left gap-4 mb-10">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-primary-500 dark:text-primary-400 text-sm font-medium">
              <i className="fa-solid fa-location-dot"></i>
              <span className="hover:text-primary-700 dark:hover:text-primary-300 cursor-pointer transition-colors">{prayerData?.country || 'Bangladesh'}</span>
              <i className="fa-solid fa-chevron-right text-[10px] text-primary-300 dark:text-primary-600"></i>
              <span className="text-charcoal dark:text-white font-bold">{prayerData?.city || 'Dhaka'}</span>
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="ml-3 w-7 h-7 bg-white dark:bg-[#0A2B20] shadow-sm border border-gray-100 dark:border-primary-800 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 rounded-full flex items-center justify-center transition-all text-softgray dark:text-gray-400" 
                title="Change location"
              >
                <i className="fa-solid fa-pen-to-square text-[11px]"></i>
              </button>
            </div>
            <div className="flex flex-row flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-5 text-[11px] sm:text-sm">
              <div className="flex items-center gap-1.5 sm:gap-2 text-softgray dark:text-gray-400">
                <i className="fa-regular fa-calendar text-primary-400"></i>
                <span className="font-medium text-charcoal dark:text-gray-200">{prayerData?.readableDate || currentDate.gregorian}</span>
              </div>
              <span className="text-gray-300 dark:text-primary-800">|</span>
              <div className="flex items-center gap-1.5 sm:gap-2 text-softgray dark:text-gray-400">
                <i className="fa-regular fa-moon text-primary-400"></i>
                <span className="font-medium text-charcoal dark:text-gray-200">{prayerData?.hijriDate || currentDate.hijri}</span>
              </div>
            </div>
          </div>

          {/* Main Hero Grid: Countdown + Schedule */}
          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            
            {/* Current/Next Prayer Card */}
            <div className="lg:col-span-1 h-full">
              <div className="bg-white dark:bg-[#0A2B20] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-8 border border-gray-100 dark:border-primary-800/50 h-full flex flex-col justify-between relative overflow-hidden group hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-500">
                {/* Subtle decorative gradient */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-50 dark:bg-primary-900/30 rounded-full blur-3xl opacity-60 group-hover:bg-primary-100 dark:group-hover:bg-primary-800/40 transition-colors duration-500 pointer-events-none"></div>
                
                <div className="flex items-center gap-2.5 mb-6">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${timer.isGap ? 'bg-accent-400' : 'bg-primary-400'} opacity-75`}></span>
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${timer.isGap ? 'bg-accent-500' : 'bg-primary-500'}`}></span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400">
                    {timer.isGap ? 'Upcoming Prayer' : 'Current Prayer'}
                  </span>
                </div>
                
                <p className="font-bold text-5xl mb-2 text-charcoal dark:text-white tracking-tight">
                  {timer.isGap ? timer.next : (timer.current || '...')}
                </p>
                <p className="text-softgray dark:text-gray-400 text-sm mb-8 font-medium">
                  {prayerData?.city || 'Dhaka'}, Bangladesh · Local time {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                
                <div className="bg-background dark:bg-[#061C14] rounded-2xl p-6 border border-gray-100/50 dark:border-primary-900/50 mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary-50/30 dark:to-primary-900/20"></div>
                  <p className="text-xs text-softgray dark:text-gray-400 mb-2 uppercase tracking-widest font-bold relative z-10">Remaining Until {timer.next}</p>
                  <p className="font-sans text-4xl font-bold tracking-tight text-charcoal dark:text-white relative z-10">
                    {timer.remaining.split(':')[0]}:{timer.remaining.split(':')[1]}
                    <span className="text-2xl text-softgray dark:text-gray-500 ml-1">:{timer.remaining.split(':')[2]}</span>
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-sm pt-2">
                  <span className="text-softgray dark:text-gray-400 font-medium">Next: <span className="text-charcoal dark:text-white font-bold">{timer.next}</span></span>
                  <Link 
                    href={`/prayer-times/${timer.next.toLowerCase()}/${(userSettings.country || 'bangladesh').toLowerCase().replace(/\s+/g, '-')}/${(prayerData?.city || userSettings.city || 'dhaka').toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-softgray dark:text-gray-400 font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    at <span className="text-charcoal dark:text-white font-bold">{timer.nextTime}</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Daily Prayer Schedule */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-[#0A2B20] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-8 border border-gray-100 dark:border-primary-800/50 h-full flex flex-col justify-between hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-500">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-bold text-2xl text-charcoal dark:text-white tracking-tight">Today's Prayer Schedule</h2>
                  <span className="text-xs text-softgray dark:text-gray-400 font-semibold bg-gray-50 dark:bg-[#061C14] px-3 py-1.5 rounded-lg border border-gray-100 dark:border-primary-900">
                    {prayerData?.city || 'Dhaka'} · {calculationMethods[userSettings.calculationMethod] || 'Karachi'} Method
                  </span>
                </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-10">
                  {['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Sunset', 'Maghrib', 'Isha'].map((name) => {
                    const isCurrent = timer.current === name;
                    const isNext = timer.next === name;
                    const isNonPrayer = ['Sunrise', 'Sunset'].includes(name);
                    const time = prayerData?.timings?.[name] || '--:--';
                    
                    const iconMap: any = {
                      Fajr: 'fa-regular fa-moon',
                      Sunrise: 'fa-regular fa-sun',
                      Dhuhr: 'fa-solid fa-cloud-sun',
                      Asr: 'fa-regular fa-sun',
                      Sunset: 'fa-solid fa-cloud-moon',
                      Maghrib: 'fa-solid fa-cloud-sun-rain',
                      Isha: 'fa-solid fa-star-and-crescent'
                    };

                    let badge = null;
                    if (isCurrent && !isNonPrayer) badge = "NOW";
                    else if (isNext && timer.isGap) badge = "NEXT";

                    const countrySlug = (userSettings.country || 'bangladesh').toLowerCase().replace(/\s+/g, '-');
                    const citySlug = (prayerData?.city || userSettings.city || 'dhaka').toLowerCase().replace(/\s+/g, '-');
                    const linkHref = `/prayer-times/${name.toLowerCase()}/${countrySlug}/${citySlug}`;

                    if (isCurrent || (isNext && timer.isGap)) {
                      return (
                        <Link key={name} href={linkHref} className={`rounded-2xl p-4 text-center cursor-pointer ${isCurrent && !isNonPrayer ? 'bg-primary-700 dark:bg-primary-600 shadow-lg shadow-primary-700/20 transform scale-105' : 'bg-white dark:bg-[#061C14] border-2 border-primary-500 dark:border-primary-400'} block relative z-10`}>
                          <div className={`w-12 h-12 mx-auto mb-3 rounded-xl ${isCurrent && !isNonPrayer ? 'bg-white/10 text-white' : 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'} flex items-center justify-center backdrop-blur-sm`}>
                            <i className={`${iconMap[name]} text-lg`}></i>
                          </div>
                          <p className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${isCurrent && !isNonPrayer ? 'text-primary-200' : 'text-primary-600 dark:text-primary-400'}`}>{name}</p>
                          <p className={`font-bold text-base ${isCurrent && !isNonPrayer ? 'text-white' : 'text-charcoal dark:text-white'}`}>{formatTime(time)}</p>
                          {badge && <span className={`absolute -top-2.5 -right-2.5 ${isCurrent && !isNonPrayer ? 'bg-accent text-primary-900' : 'bg-primary-600 text-white'} text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm`}>{badge}</span>}
                        </Link>
                      );
                    }

                    return (
                      <Link key={name} href={linkHref} className="group rounded-2xl p-4 text-center cursor-pointer bg-gray-50 dark:bg-[#061C14] border border-gray-100 dark:border-primary-900/50 hover:bg-white dark:hover:bg-[#082218] hover:shadow-lg hover:shadow-primary-900/10 hover:border-primary-500 dark:hover:border-primary-400 transition-all duration-300">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-800/50 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors">
                          <i className={`${iconMap[name]} text-lg`}></i>
                        </div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-softgray dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-300 mb-1 transition-colors">{name}</p>
                        <p className="text-charcoal dark:text-white font-bold text-base">{formatTime(time)}</p>
                      </Link>
                    );
                  })}
                </div>
                
                {/* Day progress bar */}
                <div>
                  <div className="flex items-center justify-between text-xs text-softgray dark:text-gray-400 mb-2.5 font-semibold">
                    <span>Fajr {prayerData?.timings?.Fajr || '4:57 AM'}</span>
                    <span className="text-charcoal dark:text-white font-bold">{timer.current} &larr; <span className="text-primary-600 dark:text-primary-400 ml-1">Now</span></span>
                    <span>Isha {prayerData?.timings?.Isha || '7:52 PM'}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-primary-900/50 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-primary-500 rounded-full shadow-[0_0_10px_rgba(61,119,96,0.5)] transition-all duration-1000" 
                      style={{ 
                        width: prayerData?.timings ? (() => {
                          const now = new Date();
                          const [fH, fM] = prayerData.timings.Fajr.split(':');
                          const [iH, iM] = prayerData.timings.Isha.split(':');
                          const start = new Date(now).setHours(parseInt(fH), parseInt(fM), 0, 0);
                          const end = new Date(now).setHours(parseInt(iH), parseInt(iM), 0, 0);
                          const progress = Math.min(Math.max(0, (now.getTime() - start) / (end - start)), 1);
                          return `${progress * 100}%`;
                        })() : '0%' 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EXPLORE RESOURCES GRID (Slightly different background to distinguish section) */}
      <section className="py-16 relative bg-white/60 dark:bg-[#061C14]/50 border-y border-white/50 dark:border-primary-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-charcoal dark:text-white tracking-tight mb-2">Explore Resources</h2>
              <p className="text-softgray dark:text-gray-400 text-base">Comprehensive tools for your daily spiritual journey.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <Link href="/quran" className="group block bg-white dark:bg-[#0A2B20] shadow-sm dark:shadow-none border border-gray-100 dark:border-primary-800/50 rounded-2xl p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-primary-200 dark:hover:border-primary-600 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl group-hover:bg-primary-600 dark:group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <i className="fa-solid fa-book-quran"></i>
                </div>
                <div>
                  <h3 className="font-bold text-charcoal dark:text-white text-lg mb-1 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">Read Quran</h3>
                  <p className="text-sm text-softgray dark:text-gray-400 font-medium">Translations & Audio</p>
                </div>
              </div>
            </Link>

            <Link href="/hadith" className="group block bg-white dark:bg-[#0A2B20] shadow-sm dark:shadow-none border border-gray-100 dark:border-primary-800/50 rounded-2xl p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-primary-200 dark:hover:border-primary-600 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl group-hover:bg-primary-600 dark:group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <i className="fa-solid fa-scroll"></i>
                </div>
                <div>
                  <h3 className="font-bold text-charcoal dark:text-white text-lg mb-1 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">Hadith Collection</h3>
                  <p className="text-sm text-softgray dark:text-gray-400 font-medium">Major Sunnah Books</p>
                </div>
              </div>
            </Link>

            <Link href="/duas" className="group block bg-white dark:bg-[#0A2B20] shadow-sm dark:shadow-none border border-gray-100 dark:border-primary-800/50 rounded-2xl p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-primary-200 dark:hover:border-primary-600 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl group-hover:bg-primary-600 dark:group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <i className="fa-solid fa-hands-praying"></i>
                </div>
                <div>
                  <h3 className="font-bold text-charcoal dark:text-white text-lg mb-1 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">Dua Library</h3>
                  <p className="text-sm text-softgray dark:text-gray-400 font-medium">Supplications for daily life</p>
                </div>
              </div>
            </Link>

            <Link href="/tools/calendar" className="group block bg-white dark:bg-[#0A2B20] shadow-sm dark:shadow-none border border-gray-100 dark:border-primary-800/50 rounded-2xl p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-primary-200 dark:hover:border-primary-600 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl group-hover:bg-primary-600 dark:group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <i className="fa-regular fa-calendar-days"></i>
                </div>
                <div>
                  <h3 className="font-bold text-charcoal dark:text-white text-lg mb-1 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">Islamic Calendar</h3>
                  <p className="text-sm text-softgray dark:text-gray-400 font-medium">Hijri dates & Events</p>
                </div>
              </div>
            </Link>

            <Link href="/tools/99-names" className="group block bg-white dark:bg-[#0A2B20] shadow-sm dark:shadow-none border border-gray-100 dark:border-primary-800/50 rounded-2xl p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-primary-200 dark:hover:border-primary-600 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl group-hover:bg-primary-600 dark:group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <i className="fa-regular fa-gem"></i>
                </div>
                <div>
                  <h3 className="font-bold text-charcoal dark:text-white text-lg mb-1 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">99 Names of Allah</h3>
                  <p className="text-sm text-softgray dark:text-gray-400 font-medium">Asma ul Husna & Meanings</p>
                </div>
              </div>
            </Link>

            <Link href="/tools/qibla" className="group block bg-white dark:bg-[#0A2B20] shadow-sm dark:shadow-none border border-gray-100 dark:border-primary-800/50 rounded-2xl p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-primary-200 dark:hover:border-primary-600 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl group-hover:bg-primary-600 dark:group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <i className="fa-regular fa-compass"></i>
                </div>
                <div>
                  <h3 className="font-bold text-charcoal dark:text-white text-lg mb-1 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">Qibla Direction</h3>
                  <p className="text-sm text-softgray dark:text-gray-400 font-medium">Accurate compass & map</p>
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* 3. DAILY INSPIRATION — HADITH OF THE DAY (Distinguished background) */}
      <section className="py-20 relative bg-primary-50/20 dark:bg-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">
              <i className="fa-solid fa-star-and-crescent text-[10px]"></i> Daily Inspiration
            </span>
            <h2 className="font-bold text-3xl lg:text-4xl text-charcoal dark:text-white tracking-tight">Hadith of the Day</h2>
            <div className="w-24 h-1 bg-accent/40 dark:bg-accent/60 mx-auto mt-6 rounded-full"></div>
          </div>
          
          <div className="bg-white dark:bg-[#0A2B20] rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-8 lg:p-12 relative border border-gray-100 dark:border-primary-800/50 overflow-hidden group">
            
            {/* Minimal Background Element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50/50 dark:bg-primary-900/20 rounded-bl-full -z-0 opacity-50 pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <span className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-xs font-bold px-4 py-1.5 rounded-full border border-primary-100 dark:border-primary-800">
                <i className="fa-regular fa-bookmark"></i> Hadith
              </span>
              <span className="text-softgray dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
                {hadithData?.collection || 'Sahih Bukhari'}
              </span>
            </div>
            
            <div className="relative mb-8 pb-8 border-b border-gray-100 dark:border-primary-800/50 z-10">
              <p dir="rtl" lang="ar" className="font-arabic text-4xl lg:text-5xl leading-tight text-charcoal dark:text-white text-center">
                {hadithData?.arabic || 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى'}
              </p>
            </div>
            
            <blockquote className="text-xl lg:text-2xl text-charcoal dark:text-gray-200 leading-relaxed mb-8 font-medium italic text-center z-10 relative">
              "{hadithData?.translation || 'Actions are judged by intentions, and every person will have what they intended.'}"
            </blockquote>
            
            <p className="text-softgray dark:text-gray-400 text-base leading-relaxed mb-10 text-center max-w-2xl mx-auto z-10 relative">
              {hadithData?.explanation || 'This foundational hadith teaches that the validity and reward of any action depends entirely upon the sincerity of one\'s intention. A seemingly righteous act done for worldly reasons holds no spiritual weight, while even ordinary actions done for Allah\'s sake become acts of worship.'}
            </p>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-2 z-10 relative">
              <div>
                <p className="text-base font-bold text-charcoal dark:text-white">{hadithData?.collection || 'Sahih Al-Bukhari'}</p>
                <p className="text-sm text-softgray dark:text-gray-400 mt-1">{hadithData?.book || 'Book 1, Hadith 1'} · Narrated by {hadithData?.narrator || 'Umar ibn Al-Khattab (RA)'}</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="w-10 h-10 bg-white dark:bg-[#061C14] border border-gray-200 dark:border-primary-800 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-300 rounded-full flex items-center justify-center text-softgray dark:text-gray-400 transition-all" title="Copy">
                  <i className="fa-regular fa-copy"></i>
                </button>
                <button className="w-10 h-10 bg-white dark:bg-[#061C14] border border-gray-200 dark:border-primary-800 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-300 rounded-full flex items-center justify-center text-softgray dark:text-gray-400 transition-all" title="Share">
                  <i className="fa-solid fa-arrow-up-right-from-square text-sm"></i>
                </button>
                <Link href="/hadith" className="flex items-center gap-2 bg-charcoal dark:bg-primary-600 hover:bg-black dark:hover:bg-primary-500 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all shadow-md dark:shadow-none">
                  Read More
                </Link>
              </div>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Hadith Section */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-[#0A2B20] rounded-3xl p-8 border border-gray-100 dark:border-primary-800/50 shadow-sm h-full hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                    <i className="fa-solid fa-book-quran"></i>
                  </div>
                  <h3 className="font-bold text-lg text-charcoal dark:text-white">Hadith of the Day</h3>
                </div>
                
                {loadingDaily ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-100 dark:bg-gray-800/50 rounded w-1/2 mt-6"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed italic mb-6">
                      "{hadithData?.text || 'He who follows a path in search of knowledge, Allah will make easy for him a path to Paradise.'}"
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest">{hadithData?.source || 'Sahih Muslim'}</span>
                      <button className="text-softgray dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        <i className="fa-solid fa-share-nodes"></i>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Daily Dua Section */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-[#0A2B20] rounded-3xl p-8 border border-gray-100 dark:border-primary-800/50 shadow-sm h-full hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-accent-50 dark:bg-accent-900/10 flex items-center justify-center text-accent-600 dark:text-accent-400">
                    <i className="fa-solid fa-hands-praying"></i>
                  </div>
                  <h3 className="font-bold text-lg text-charcoal dark:text-white">Daily Dua</h3>
                </div>
                
                {loadingDaily ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-100 dark:bg-gray-800/50 rounded w-1/2 mt-6"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-2xl text-right mb-4 font-arabic text-charcoal dark:text-white leading-loose">
                      {duaData?.arabic || 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                      {duaData?.translation || 'Our Lord, give us in this world that which is good and in the Hereafter that which is good.'}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs font-bold text-accent-600 dark:text-accent-400 uppercase tracking-widest">{duaData?.reference || 'Surah Al-Baqarah 201'}</span>
                      <button className="text-softgray dark:text-gray-500 hover:text-accent-600 dark:hover:text-accent-400 transition-colors">
                        <i className="fa-solid fa-play"></i>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </section>
    </>
  );
}
