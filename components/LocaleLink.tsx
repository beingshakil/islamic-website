"use client";
import NextLink from 'next/link';
import { useParams } from 'next/navigation';
import type { ComponentProps } from 'react';
import { DEFAULT_LOCALE, hasLocale, localizePath, type Locale } from '@/utils/i18n';

/** The language of the current page, from the /{lang}/ URL segment. */
export function useLocale(): Locale {
  const params = useParams<{ lang?: string }>();
  return hasLocale(params?.lang) ? params.lang : DEFAULT_LOCALE;
}

/**
 * Drop-in replacement for next/link that keeps the visitor in their language:
 * <Link href="/quran"> renders /en/quran (or /bn/quran on a Bengali page).
 * Pass `locale` to link to a specific language (used by the language switcher).
 */
export default function Link({ href, locale, ...props }: ComponentProps<typeof NextLink> & { locale?: Locale }) {
  const current = useLocale();
  const target = locale ?? current;
  const localized = typeof href === 'string' ? localizePath(target, href) : href;
  return <NextLink href={localized} {...props} />;
}
