"use client";
import { useEffect, useState } from 'react';

// Client-side access to the prayer-times API.
//
// The API is rate limited (100 requests per IP per window), so:
//  - responses are cached per query for the current day (memory + localStorage);
//    prayer times for a place don't change during the day,
//  - identical requests in flight share one network call,
//  - a 429 becomes a RateLimitError carrying the server's Retry-After.

export interface PrayerQuery {
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  school?: string;
  method?: string;
  tune?: string;
}

export class RateLimitError extends Error {
  constructor(public retryAfter: number) {
    super('The prayer times service is busy right now.');
    this.name = 'RateLimitError';
  }
}

const STORAGE_PREFIX = 'prayer-times:';
const memory = new Map<string, any>();
const inflight = new Map<string, Promise<any>>();

/** Local calendar day, so the cache rolls over at the user's midnight. */
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

export const buildPrayerQuery = (q: PrayerQuery) => {
  const params = new URLSearchParams();
  if (q.latitude != null && q.longitude != null) {
    params.set('latitude', String(q.latitude));
    params.set('longitude', String(q.longitude));
  } else {
    params.set('city', q.city ?? '');
    params.set('country', q.country ?? '');
  }
  params.set('school', q.school ?? '1');
  params.set('method', q.method ?? '1');
  params.set('tune', q.tune ?? '');
  return params.toString();
};

const readStored = (key: string) => {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeStored = (key: string, value: any) => {
  try {
    // Drop entries from previous days so storage doesn't grow forever.
    const day = today();
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k?.startsWith(STORAGE_PREFIX) && !k.startsWith(`${STORAGE_PREFIX}${day}|`)) localStorage.removeItem(k);
    }
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage full or blocked: memory cache still works */
  }
};

/** Seed the cache with data already loaded elsewhere (e.g. server-rendered). */
export const primePrayerCache = (q: PrayerQuery, data: any) => {
  if (!data?.timings) return;
  const key = `${today()}|${buildPrayerQuery(q)}`;
  memory.set(key, data);
};

export async function fetchPrayerTimes(q: PrayerQuery): Promise<any> {
  const query = buildPrayerQuery(q);
  const key = `${today()}|${query}`;

  if (memory.has(key)) return memory.get(key);
  const stored = readStored(key);
  if (stored) {
    memory.set(key, stored);
    return stored;
  }
  if (inflight.has(key)) return inflight.get(key);

  const request = (async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prayer-times?${query}`);
    if (res.status === 429) {
      const retryAfter = Number(res.headers.get('retry-after')) || 60;
      throw new RateLimitError(retryAfter);
    }
    if (!res.ok) throw new Error(`Could not load prayer times (error ${res.status}).`);
    const json = await res.json();
    if (!json?.timings) throw new Error('Invalid data received from server.');
    memory.set(key, json);
    writeStored(key, json);
    return json;
  })();

  inflight.set(key, request);
  try {
    return await request;
  } finally {
    inflight.delete(key);
  }
}

/**
 * React hook around fetchPrayerTimes. Pass null to wait (e.g. until settings load).
 * When rate limited it counts down `retryIn` and retries on its own.
 */
export function usePrayerTimes(q: PrayerQuery | null, initial?: { query: PrayerQuery; data: any } | null) {
  const query = q ? buildPrayerQuery(q) : null;
  // Server-rendered data shows immediately (and is what crawlers see); it also seeds
  // the cache so a matching client query doesn't hit the API again.
  const [data, setData] = useState<any>(() => {
    if (initial?.data && typeof window !== 'undefined') primePrayerCache(initial.query, initial.data);
    return initial?.data ?? null;
  });
  const [loading, setLoading] = useState(!initial?.data);
  const [error, setError] = useState<string | null>(null);
  const [retryIn, setRetryIn] = useState(0);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!q || !query) return;
    let active = true;
    let tick: ReturnType<typeof setInterval> | undefined;

    setLoading(true);
    setError(null);
    setRetryIn(0);

    fetchPrayerTimes(q)
      .then((json) => { if (active) { setData(json); setLoading(false); } })
      .catch((err) => {
        if (!active) return;
        if (err instanceof RateLimitError) {
          let left = err.retryAfter;
          setRetryIn(left);
          tick = setInterval(() => {
            left -= 1;
            if (!active) return;
            if (left <= 0) { clearInterval(tick); setAttempt((a) => a + 1); }
            else setRetryIn(left);
          }, 1000);
        } else {
          setError(err.message || 'Could not load prayer times.');
          setLoading(false);
        }
      });

    return () => { active = false; if (tick) clearInterval(tick); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, attempt]);

  return { data, loading, error, retryIn, retry: () => setAttempt((a) => a + 1) };
}
