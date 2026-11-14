import type { Metadata } from 'next';
import ComingSoon from '@/components/ComingSoon';
import { comingSoonMetadata } from '@/utils/seo';

// Not built yet: titled, but noindex and excluded from the sitemap (see app/sitemap.ts).
// When this page has real content, replace comingSoonMetadata with pageMetadata and add it to the sitemap.
export async function generateMetadata({ params }: { params: Promise<{ lang: string; bookId: string; chapterId: string; hadithId: string }> }): Promise<Metadata> {
  const p = await params;
  return comingSoonMetadata(p.lang, `/hadith/${p.bookId}/${p.chapterId}/${p.hadithId}`, 'Hadith');
}

export default function Page() {
  return <ComingSoon title="Hadith" />;
}
