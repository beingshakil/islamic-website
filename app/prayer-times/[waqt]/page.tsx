"use client";
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import SettingsModal from '@/components/SettingsModal';

export default function WaqtPage({ params }: { params: Promise<{ waqt: string }> }) {
  const { waqt } = use(params);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userSettings, setUserSettings] = useState({
    locationType: 'auto',
    country: 'Bangladesh',
    city: 'Dhaka',
    timeFormat: '12',
    juristicMethod: '1',
    calculationMethod: '1',
    tune: ''
  });

  const [prayerData, setPrayerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

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
    
    const fetchPrayerTimes = async () => {
      setLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const query = `city=${userSettings.city}&country=${userSettings.country}&school=${userSettings.juristicMethod}&method=${userSettings.calculationMethod}&tune=${userSettings.tune || ''}`;
        const res = await fetch(`${apiUrl}/prayer-times?${query}`);
        if (res.ok) {
          const json = await res.json();
          setPrayerData(json);
        }
      } catch (error) {
        console.error('Error fetching prayer times:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrayerTimes();
  }, [settingsLoaded, userSettings.city, userSettings.country, userSettings.juristicMethod, userSettings.calculationMethod]);

  const waqtName = waqt.charAt(0).toUpperCase() + waqt.slice(1);

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

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: `When is ${waqtName} time in ${userSettings.city} today?`,
      a: `Today in ${userSettings.city}, ${userSettings.country} ${waqtName} starts at ${start} and ends at ${end} (before the next prayer starts).`
    },
    {
      q: `Can ${waqtName} be prayed after its time ends?`,
      a: `Performing prayers on time is obligatory. If a prayer is missed, it must be performed as Qaza as soon as possible, but it should not be intentionally delayed beyond its prescribed time.`
    },
    {
      q: `How many Rakats are there in ${waqtName} prayer?`,
      a: `Obligatory (Fard) Rakats for ${waqtName}: ${waqtName === 'Fajr' ? '2' : waqtName === 'Maghrib' ? '3' : '4'} Rakats.`
    }
  ];

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
            <i className="fa-regular fa-sun text-2xl"></i>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal dark:text-white mb-4 tracking-tight">
            {waqtName} Prayer Time in {userSettings.city}
          </h1>
          <p className="text-softgray dark:text-gray-400 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Current {waqtName} prayer timings for {userSettings.city}, {userSettings.country}. Perform your prayers on time for spiritual success.
          </p>
          
          <div className="inline-flex flex-wrap items-center justify-center gap-3 text-sm text-softgray dark:text-gray-400 font-semibold bg-gray-50/80 dark:bg-[#061C14]/50 px-6 py-2.5 rounded-full border border-gray-100 dark:border-primary-900">
            <span 
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 cursor-pointer hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              <i className="fa-solid fa-location-dot text-primary-500"></i> {userSettings.city}, {userSettings.country}
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
        
        {/* Starts & Ends Card */}
        <div className="bg-white dark:bg-[#0A2B20] rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none border border-gray-100/50 dark:border-primary-800/50 overflow-hidden mb-6">
          <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 dark:border-primary-800/50 bg-white dark:bg-transparent">
            <div className="flex items-center gap-3 text-primary-700 dark:text-primary-400 font-bold text-base">
              <div className="w-1.5 h-5 bg-accent rounded-full"></div>
              Today's {waqtName} Time
            </div>
            <span className="text-sm text-softgray dark:text-gray-400 font-semibold bg-gray-50 dark:bg-[#061C14] px-3 py-1 rounded-lg border border-gray-100 dark:border-primary-900">Thursday</span>
          </div>
          
          <div className="grid grid-cols-2 divide-x divide-gray-100 dark:divide-primary-800/50 p-8 md:p-12">
            <div className="text-center px-4">
              <span className="text-softgray dark:text-gray-500 text-sm font-bold block mb-4 uppercase tracking-widest text-primary-600/70">Start Time</span>
              <span className="text-5xl md:text-6xl font-bold text-primary-700 dark:text-primary-400 tracking-tight">
                {loading ? '...' : start}
              </span>
              <span className="text-softgray dark:text-gray-500 text-sm block mt-4 font-medium">Exact {waqtName} entrance</span>
            </div>
            <div className="text-center px-4">
              <span className="text-softgray dark:text-gray-500 text-sm font-bold block mb-4 uppercase tracking-widest text-accent">End Time</span>
              <span className="text-5xl md:text-6xl font-bold text-charcoal dark:text-white tracking-tight">
                {loading ? '...' : end}
              </span>
              <span className="text-softgray dark:text-gray-500 text-sm block mt-4 font-medium">Before next prayer</span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 divide-x divide-gray-100 dark:divide-primary-800/50 border-t border-gray-100 dark:border-primary-800/50 text-center py-5 bg-gray-50/50 dark:bg-[#061C14]/30">
            <div>
              <span className="block text-xs text-softgray dark:text-gray-500 mb-1 uppercase tracking-wider font-bold">Total</span>
              <span className="text-sm font-bold text-charcoal dark:text-white">4 Rakat</span>
            </div>
            <div>
              <span className="block text-xs text-softgray dark:text-gray-500 mb-1 uppercase tracking-wider font-bold">Sunnah</span>
              <span className="text-sm font-bold text-charcoal dark:text-white">-</span>
            </div>
            <div>
              <span className="block text-xs text-softgray dark:text-gray-500 mb-1 uppercase tracking-wider font-bold">Fard</span>
              <span className="text-sm font-bold text-charcoal dark:text-white">4 Rakat</span>
            </div>
            <div>
              <span className="block text-xs text-softgray dark:text-gray-500 mb-1 uppercase tracking-wider font-bold">Status</span>
              <span className="text-sm font-bold text-primary-700 dark:text-primary-400">Obligatory</span>
            </div>
          </div>
        </div>

        {/* Countdown Card */}
        <div className="bg-white dark:bg-[#0A2B20] rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-primary-800/50 p-8 md:p-12 text-center mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 dark:bg-primary-900/20 rounded-bl-full opacity-50 pointer-events-none"></div>
          
          <div className="flex items-center justify-center gap-2 text-charcoal dark:text-white font-bold mb-6 text-lg">
            <i className="fa-regular fa-hourglass-half text-accent"></i> {waqtName} starts in Dhaka
          </div>
          
          <div className="flex justify-center items-center gap-6 mb-10">
            <div className="flex flex-col items-center">
              <span className="text-5xl md:text-6xl font-bold text-charcoal dark:text-white">07</span>
              <span className="text-xs text-softgray dark:text-gray-500 uppercase font-bold tracking-widest mt-2">Hours</span>
            </div>
            <span className="text-4xl text-gray-300 dark:text-primary-800 font-light -mt-6">:</span>
            <div className="flex flex-col items-center">
              <span className="text-5xl md:text-6xl font-bold text-charcoal dark:text-white">26</span>
              <span className="text-xs text-softgray dark:text-gray-500 uppercase font-bold tracking-widest mt-2">Minutes</span>
            </div>
            <span className="text-4xl text-gray-300 dark:text-primary-800 font-light -mt-6">:</span>
            <div className="flex flex-col items-center">
              <span className="text-5xl md:text-6xl font-bold text-charcoal dark:text-white">36</span>
              <span className="text-xs text-softgray dark:text-gray-500 uppercase font-bold tracking-widest mt-2">Seconds</span>
            </div>
          </div>
          
          <div className="relative w-full max-w-xl mx-auto">
            <div className="w-full bg-gray-100 dark:bg-primary-900/50 h-2 rounded-full overflow-hidden shadow-inner">
              <div className="bg-primary-600 dark:bg-primary-500 h-full rounded-full shadow-[0_0_10px_rgba(31,83,62,0.5)]" style={{ width: '35%' }}></div>
            </div>
            <div className="flex justify-between mt-3 text-xs text-softgray dark:text-gray-400 font-semibold">
              <span className="flex items-center gap-1.5"><i className="fa-regular fa-sun text-primary-500"></i> 3:30 PM</span>
              <span className="uppercase tracking-widest text-[10px]">Time Elapsed</span>
              <span className="flex items-center gap-1.5">6:22 PM <i className="fa-regular fa-moon text-gray-400 dark:text-gray-600"></i></span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          <button className="flex items-center justify-center gap-3 bg-primary-700 dark:bg-primary-600 hover:bg-primary-800 dark:hover:bg-primary-500 text-white py-4 rounded-2xl font-bold transition shadow-[0_4px_20px_rgba(15,61,46,0.2)] dark:shadow-none">
            <i className="fa-regular fa-clock"></i> Prayer Times Dhaka
          </button>
          <button className="flex items-center justify-center gap-3 bg-white dark:bg-[#0A2B20] border border-gray-200 dark:border-primary-800 text-charcoal dark:text-white hover:bg-gray-50 dark:hover:bg-[#061C14] py-4 rounded-2xl font-bold transition shadow-sm dark:shadow-none">
            <i className="fa-solid fa-utensils text-accent"></i> Sehri & Iftar Time
          </button>
        </div>

        {/* Alert Box */}
        <div className="bg-primary-50/80 dark:bg-primary-900/20 border border-primary-200/50 dark:border-primary-800/50 rounded-2xl p-5 flex gap-4 text-base text-charcoal dark:text-gray-200 leading-relaxed shadow-sm items-start">
          <div className="w-8 h-8 rounded-full bg-white dark:bg-[#061C14] flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0 shadow-sm">
            <i className="fa-solid fa-info text-sm"></i>
          </div>
          <p>
            <strong className="text-primary-800 dark:text-primary-300">Importance of Prayer:</strong> Prayer is the key to Paradise. Whoever intentionally skips even one prayer, it is as if they have committed disbelief. Therefore, it is extremely important to perform prayers on time.
          </p>
        </div>
      </section>

      {/* 3. CITIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 mb-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-charcoal dark:text-white tracking-tight">Bangladesh {waqtName} Timetable</h2>
          <p className="text-base text-softgray dark:text-gray-400 mt-2">{waqtName} Prayer times for Dhaka, Bangladesh and other cities</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* City Cards */}
          {['Amtali', 'Arankhola', 'Baisari', 'Banchpar', 'Barguna', 'Barishal', 'Barura', 'Benapol', 'Bhandaria', 'Bharella', 'Bhola', 'Bogra'].map((city, idx) => (
            <Link href="#" key={idx} className="bg-white dark:bg-[#0A2B20] border border-gray-100 dark:border-primary-800/50 rounded-2xl p-5 flex items-center gap-4 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-none transition-all group">
              <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-primary-900/30 text-softgray dark:text-gray-400 flex items-center justify-center group-hover:bg-primary-50 dark:group-hover:bg-primary-800/50 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors">
                <i className="fa-solid fa-location-dot text-sm"></i>
              </div>
              <div>
                <h4 className="text-base font-bold text-charcoal dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">{waqtName} Time {city}</h4>
                <p className="text-xs text-softgray dark:text-gray-500 font-medium mt-0.5">Bangladesh</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FAQ & DETAILS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* FAQs */}
          <div>
            <h3 className="text-xl font-bold text-charcoal dark:text-white mb-8 flex items-center gap-3">
              <i className="fa-regular fa-circle-question text-accent"></i> Frequently Asked Questions
            </h3>
            
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className={`bg-white dark:bg-[#0A2B20] border ${openFaq === idx ? 'border-primary-200 dark:border-primary-800 shadow-[0_4px_20px_rgb(0,0,0,0.03)]' : 'border-gray-100 dark:border-primary-800 shadow-sm'} rounded-2xl overflow-hidden transition-all`}>
                  <button 
                    onClick={() => toggleFaq(idx)}
                    className={`w-full text-left px-6 py-5 flex justify-between items-center ${openFaq === idx ? 'bg-primary-50/30 dark:bg-primary-900/20' : ''}`}
                  >
                    <span className={`font-bold text-base ${openFaq === idx ? 'text-primary-800 dark:text-primary-300' : 'text-charcoal dark:text-gray-200'}`}>{faq.q}</span>
                    <div className={`w-6 h-6 rounded-full ${openFaq === idx ? 'bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-400' : 'bg-gray-50 dark:bg-[#061C14] text-softgray'} flex items-center justify-center transition-all`}>
                      <i className={`fa-solid ${openFaq === idx ? 'fa-chevron-up' : 'fa-plus'} text-[10px]`}></i>
                    </div>
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 pb-6 pt-2 text-base text-charcoal dark:text-gray-200 leading-relaxed bg-white dark:bg-transparent animate-in fade-in slide-in-from-top-2 duration-300">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-right">
              <Link href="#" className="text-primary-700 dark:text-primary-400 text-sm font-bold hover:text-primary-800 dark:hover:text-primary-300 flex items-center justify-end gap-2 group">
                View More
                <div className="w-6 h-6 rounded-full bg-primary-50 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:bg-primary-100 dark:group-hover:bg-primary-800 transition-colors">
                  <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </div>
              </Link>
            </div>
          </div>

          {/* Details Paragraph */}
          <div>
            <h3 className="text-xl font-bold text-charcoal dark:text-white mb-8 text-center md:text-left">
              Today's {waqtName} Prayer Time in Dhaka
            </h3>
            <div className="bg-white dark:bg-[#0A2B20] border border-gray-100 dark:border-primary-800/50 p-8 rounded-[24px] text-base text-charcoal dark:text-gray-200 leading-relaxed shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-bl-full pointer-events-none"></div>
              
              <p className="mb-5 relative z-10">
                <strong className="text-primary-800 dark:text-primary-300">{waqtName} prayer starts in Dhaka at 03:30 PM</strong> (after Dhuhr time ends) and ends at 06:22 PM (before sunset). However, it is best to perform {waqtName} prayer before the Makruh time starts.
              </p>
              <p className="mb-5 relative z-10">
                Today's Prayer Schedule for Dhaka: Fajr 04:57 AM, Sunrise 06:18 AM, Dhuhr 12:04 PM, Asr 03:30 PM, Maghrib 06:31 PM, Isha 07:52 PM.
              </p>
              <p className="relative z-10">
                Dhaka's location is Bangladesh at Latitude 23.7639°N, Longitude 90.3789°E. Qibla direction is 277.6° (West). Karachi method and Asia/Dhaka (UTC+6) timezone have been used for prayer time calculation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
