import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatTime } from '@/utils/time';

interface PrayerHeroProps {
  prayerData: any;
  userSettings: any;
  timer: any;
  currentDate: any;
  onOpenSettings: () => void;
  calculationMethods: Record<string, string>;
}

export default function PrayerHero({ 
  prayerData, 
  userSettings, 
  timer, 
  currentDate, 
  onOpenSettings,
  calculationMethods 
}: PrayerHeroProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const calculateProgress = () => {
    if (!prayerData?.timings || !mounted) return '0%';
    
    const now = new Date();
    const [fH, fM] = prayerData.timings.Fajr.split(':');
    const [iH, iM] = prayerData.timings.Isha.split(':');
    const start = new Date(now).setHours(parseInt(fH), parseInt(fM), 0, 0);
    const end = new Date(now).setHours(parseInt(iH), parseInt(iM), 0, 0);
    const progress = Math.min(Math.max(0, (now.getTime() - start) / (end - start)), 1);
    return `${progress * 100}%`;
  };

  return (
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
              onClick={onOpenSettings}
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
                {prayerData?.city || 'Dhaka'}, Bangladesh · Local time {mounted ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
              </p>
              
              <div className="bg-background dark:bg-[#061C14] rounded-2xl p-6 border border-gray-100/50 dark:border-primary-900/50 mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary-50/30 dark:to-primary-900/20"></div>
                <p className="text-xs text-softgray dark:text-gray-400 mb-2 uppercase tracking-widest font-bold relative z-10">Remaining Until {timer.next}</p>
                <p className="font-sans text-4xl font-bold tracking-tight text-charcoal dark:text-white relative z-10">
                  {timer.remaining ? (
                    <>
                      {timer.remaining.split(':')[0]}:{timer.remaining.split(':')[1]}
                      <span className="text-2xl text-softgray dark:text-gray-500 ml-1">:{timer.remaining.split(':')[2]}</span>
                    </>
                  ) : '--:--:--'}
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
                        <p className={`font-bold text-base ${isCurrent && !isNonPrayer ? 'text-white' : 'text-charcoal dark:text-white'}`}>{formatTime(time, userSettings.timeFormat)}</p>
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
                      <p className="text-charcoal dark:text-white font-bold text-base">{formatTime(time, userSettings.timeFormat)}</p>
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
                      width: calculateProgress()
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
