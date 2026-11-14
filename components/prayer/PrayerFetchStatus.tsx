"use client";

interface PrayerFetchStatusProps {
  error: string | null;
  retryIn: number;
  onRetry: () => void;
}

/** Shown in place of prayer times while rate-limited or after a failed load. Renders nothing otherwise. */
export default function PrayerFetchStatus({ error, retryIn, onRetry }: PrayerFetchStatusProps) {
  if (retryIn > 0) {
    const mins = Math.floor(retryIn / 60);
    const secs = retryIn % 60;
    return (
      <div className="bg-amber-50 dark:bg-amber-900/20 border-t border-amber-200 dark:border-amber-800 p-8 text-center" role="status" aria-live="polite">
        <i className="fa-regular fa-hourglass-half text-amber-500 text-3xl mb-4"></i>
        <p className="text-amber-800 dark:text-amber-300 font-bold mb-2">Prayer times service is busy</p>
        <p className="text-amber-700 dark:text-amber-400 text-sm">
          Too many requests right now. Retrying automatically in{' '}
          <span className="font-bold tabular-nums">{mins > 0 ? `${mins}:${String(secs).padStart(2, '0')}` : `${secs}s`}</span>.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800 p-8 text-center" role="alert">
        <i className="fa-solid fa-triangle-exclamation text-red-500 text-3xl mb-4"></i>
        <p className="text-red-700 dark:text-red-400 font-bold mb-2">Failed to load prayer times</p>
        <p className="text-red-600 dark:text-red-500 text-sm mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return null;
}
