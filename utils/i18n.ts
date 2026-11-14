// Supported languages. Every page lives under /{lang}/..., e.g. /en/quran.
// To add a language, add it here (and a dictionary entry once content is translated).
//
// `indexed`: whether search engines should index this language. Keep it false until
// the content is actually translated, otherwise /bn/ pages are duplicates of /en/ pages
// (they get noindex + a canonical pointing to the English URL, and stay out of the sitemap).

export const LOCALES = {
  en: { name: 'English', nativeName: 'English', dir: 'ltr', hreflang: 'en', ogLocale: 'en_US', indexed: true },
  bn: { name: 'Bengali', nativeName: 'বাংলা', dir: 'ltr', hreflang: 'bn', ogLocale: 'bn_BD', indexed: false },
} as const;

export type Locale = keyof typeof LOCALES;

export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_LIST = Object.keys(LOCALES) as Locale[];
export const INDEXED_LOCALES = LOCALE_LIST.filter((l) => LOCALES[l].indexed);
export const LOCALE_COOKIE = 'NEXT_LOCALE';

export const hasLocale = (value: string | undefined | null): value is Locale =>
  !!value && Object.prototype.hasOwnProperty.call(LOCALES, value);

export const isIndexedLocale = (value: string) => hasLocale(value) && LOCALES[value].indexed;

/** Returns the locale prefix of a pathname, if it has one. "/bn/quran" -> "bn" */
export const getPathLocale = (pathname: string): Locale | null => {
  const first = pathname.split('/')[1];
  return hasLocale(first) ? first : null;
};

/** Removes the locale prefix. "/bn/quran" -> "/quran", "/bn" -> "/" */
export const stripLocale = (pathname: string) => {
  const locale = getPathLocale(pathname);
  if (!locale) return pathname;
  return pathname.slice(locale.length + 1) || '/';
};

/**
 * Prefixes an internal path with the locale. Leaves external URLs, hashes,
 * and already-localized paths alone.
 *   localizePath('en', '/quran')    -> '/en/quran'
 *   localizePath('en', '/')         -> '/en'
 *   localizePath('bn', '/en/quran') -> '/bn/quran'
 */
export const localizePath = (locale: Locale, path: string) => {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  const rest = stripLocale(path);
  return rest === '/' ? `/${locale}` : `/${locale}${rest}`;
};
