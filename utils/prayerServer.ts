// Server-side prayer times fetch, so times are in the HTML search engines crawl.
// Cached for an hour per city (Next.js data cache); returns null on any failure
// (including the API's 429 rate limit), in which case the page loads times client-side.
import { DEFAULT_METHOD } from '@/utils/site';

export interface PrayerData {
  city: string;
  date: string;
  readableDate: string;
  hijriDate: string;
  timings: Record<string, string>;
}

export async function getPrayerTimes(city: string, country: string): Promise<PrayerData | null> {
  const params = new URLSearchParams({ city, country, ...DEFAULT_METHOD });
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prayer-times?${params}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.timings ? json : null;
  } catch {
    return null;
  }
}
