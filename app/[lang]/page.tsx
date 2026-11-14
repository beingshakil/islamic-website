import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import HomeClient from './HomeClient';
import JsonLd from '@/components/seo/JsonLd';
import { DEFAULT_LOCALE, hasLocale, LOCALES, localizePath } from '@/utils/i18n';
import { pageMetadata } from '@/utils/seo';
import { graph, webPageSchema } from '@/utils/schema';

const TITLE = 'Prayer Times Today – Accurate Namaz, Salah & Azan Times';
const DESCRIPTION =
  "Accurate prayer times today for your city: Fajr, Dhuhr, Asr, Maghrib & Isha with a live countdown, Sehri & Iftar times. Check your namaz times now.";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({ lang, path: '/', title: TITLE, description: DESCRIPTION, absoluteTitle: true });
}

async function getDailyContent() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  
  try {
    const [hadithRes, duaRes] = await Promise.all([
      fetch(`${apiUrl}/hadith-of-the-day`, { next: { revalidate: 3600 } }),
      fetch(`${apiUrl}/dua-of-the-day`, { next: { revalidate: 3600 } })
    ]);

    let hadithData = null;
    let duaData = null;

    if (hadithRes.ok) hadithData = await hadithRes.json();
    if (duaRes.ok) duaData = await duaRes.json();

    return { hadithData, duaData };
  } catch (error) {
    console.error('Error pre-fetching daily content:', error);
    return { hadithData: null, duaData: null };
  }
}

async function getPrayerData(settings: any) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const { city, country, juristicMethod, calculationMethod, tune } = settings;
  
  const query = `city=${city}&country=${country}&school=${juristicMethod}&method=${calculationMethod}&tune=${tune || ''}`;
  
  try {
    const res = await fetch(`${apiUrl}/prayer-times?${query}`, { next: { revalidate: 3600 } });
    if (res.ok) return await res.json();
    return null;
  } catch (error) {
    console.error('Error pre-fetching prayer data:', error);
    return null;
  }
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  const cookieStore = await cookies();
  const settingsCookie = cookieStore.get('user-settings');
  
  let userSettings = {
    locationType: 'auto',
    country: 'Bangladesh',
    city: 'Dhaka',
    timeFormat: '12',
    juristicMethod: '1',
    calculationMethod: '1',
    tune: ''
  };

  if (settingsCookie) {
    try {
      userSettings = JSON.parse(settingsCookie.value);
    } catch (e) {
      console.error('Error parsing settings cookie');
    }
  }

  const [dailyContent, prayerData] = await Promise.all([
    getDailyContent(),
    getPrayerData(userSettings)
  ]);

  const schema = graph(
    webPageSchema({ path: localizePath(locale, '/'), name: TITLE, description: DESCRIPTION, inLanguage: LOCALES[locale].hreflang }),
  );

  return (
    <>
    <JsonLd data={schema} />
    <HomeClient 
      initialHadith={dailyContent.hadithData} 
      initialDua={dailyContent.duaData} 
      initialPrayerData={prayerData}
      initialSettings={userSettings}
    />
    </>
  );
}
