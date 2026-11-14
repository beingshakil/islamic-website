import { permanentRedirect } from 'next/navigation';
import { fromSlug, waqtTimePath } from '@/utils/routes';
import { DEFAULT_LOCALE, hasLocale, localizePath } from '@/utils/i18n';

// Legacy URL: /{lang}/prayer-times/{waqt}/{country}/{city}
// New URL:    /{lang}/countries/{country}/{waqt}-time-{city}
export default async function LegacyWaqtRedirect({ params }: { params: Promise<{ lang: string; waqt: string; country: string; city: string }> }) {
  const { lang, waqt, country, city } = await params;
  const locale = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  permanentRedirect(localizePath(locale, waqtTimePath(waqt, fromSlug(country), fromSlug(city))));
}
