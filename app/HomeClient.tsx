"use client";
import { useState, useEffect } from 'react';
import SettingsModal from '@/components/SettingsModal';
import PrayerHero from '@/components/home/PrayerHero';
import ResourceGrid from '@/components/home/ResourceGrid';
import DailyInspiration from '@/components/home/DailyInspiration';
import { formatTime } from '@/utils/time';

interface HomeClientProps {
  initialHadith: any;
  initialDua: any;
  initialPrayerData: any;
  initialSettings: any;
}

export default function HomeClient({ initialHadith, initialDua, initialPrayerData, initialSettings }: HomeClientProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [prayerData, setPrayerData] = useState<any>(initialPrayerData);
  const [hadithData, setHadithData] = useState<any>(initialHadith);
  const [duaData, setDuaData] = useState<any>(initialDua);
  const [loadingPrayer, setLoadingPrayer] = useState(!initialPrayerData);
  const [loadingDaily, setLoadingDaily] = useState(!initialHadith || !initialDua);
  const [currentDate, setCurrentDate] = useState({ gregorian: '', hijri: '' });
  const [timer, setTimer] = useState({ current: '', next: '', remaining: '', nextTime: '', isGap: false });
  const [gpsLocation, setGpsLocation] = useState<string | null>(null);
  const [prayerCache, setPrayerCache] = useState<Record<string, any>>(
    initialPrayerData ? { [JSON.stringify(initialSettings)]: initialPrayerData } : {}
  );
  const [userSettings, setUserSettings] = useState<any>(initialSettings || {
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

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('islamic-website-settings');
    if (savedSettings) {
      setUserSettings(JSON.parse(savedSettings));
    }
    setSettingsLoaded(true);
  }, []);

  const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  };

  const handleSettingsSave = (newSettings: any) => {
    setUserSettings(newSettings);
    localStorage.setItem('islamic-website-settings', JSON.stringify(newSettings));
    setCookie('user-settings', JSON.stringify(newSettings), 30);
  };

  // Prayer Logic Calculation
  useEffect(() => {
    if (!prayerData) return;

    const updateTimer = () => {
      const now = new Date();
      const timings = prayerData.timings;
      
      const prayerNames = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Sunset', 'Maghrib', 'Isha'];
      const prayerTimes: { name: string; time: Date }[] = [];

      prayerNames.forEach(name => {
        const timeStr = timings[name];
        if (!timeStr) return;

        const [hours, minutes] = timeStr.split(':');
        const prayerDate = new Date(now);
        prayerDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        prayerTimes.push({ name, time: prayerDate });
      });

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
        nextTime: formatTime(nextPrayer.time.getHours().toString().padStart(2, '0') + ':' + nextPrayer.time.getMinutes().toString().padStart(2, '0'), userSettings.timeFormat),
        isGap: isNonPrayer
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [prayerData, userSettings.timeFormat]);

  useEffect(() => {
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
    
    const fetchPrayerTimes = async () => {
      let prayerQuery = `city=${userSettings.city}&country=${userSettings.country}&school=${userSettings.juristicMethod}&method=${userSettings.calculationMethod}&tune=${userSettings.tune || ''}`;
      
      if (prayerCache[prayerQuery]) {
        setPrayerData(prayerCache[prayerQuery]);
        setLoadingPrayer(false);
        return;
      }

      setLoadingPrayer(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        let usedGps = false;

        if (userSettings.locationType === 'auto' && "geolocation" in navigator) {
          try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
            });
            prayerQuery = `latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&school=${userSettings.juristicMethod}&method=${userSettings.calculationMethod}&tune=${userSettings.tune || ''}`;
            
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
        
        setPrayerData(json);
        setPrayerCache(prev => ({ ...prev, [prayerQuery]: json }));
        
        if (usedGps && json.city) setGpsLocation(`${json.city}, ${json.country || 'Bangladesh'}`);
      } catch (error) {
        console.error('Error fetching prayer times:', error);
      } finally {
        setLoadingPrayer(false);
      }
    };

    fetchPrayerTimes();
  }, [userSettings, settingsLoaded]);

  // Fetch daily content if not provided by SSR
  useEffect(() => {
    if (initialHadith && initialDua) return;
    
    const fetchDailyContent = async () => {
      setLoadingDaily(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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

    fetchDailyContent();
  }, [initialHadith, initialDua]);

  return (
    <>
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onSave={handleSettingsSave}
        currentSettings={userSettings}
        detectedLocation={gpsLocation || undefined}
      />
      
      <PrayerHero 
        prayerData={prayerData}
        userSettings={userSettings}
        timer={timer}
        currentDate={currentDate}
        onOpenSettings={() => setIsSettingsOpen(true)}
        calculationMethods={calculationMethods}
      />

      <ResourceGrid />

      <DailyInspiration 
        hadithData={hadithData}
        duaData={duaData}
        loading={loadingDaily}
      />
    </>
  );
}
