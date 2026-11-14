import { permanentRedirect } from 'next/navigation';
import { DEFAULT_LOCALE, hasLocale, localizePath } from '@/utils/i18n';
import { calendarPath } from '@/utils/routes';

// Legacy URL: /{lang}/tools/calendar  ->  /{lang}/calendar
export default async function LegacyCalendarRedirect({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  permanentRedirect(localizePath(hasLocale(lang) ? lang : DEFAULT_LOCALE, calendarPath()));
}
