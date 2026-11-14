import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import WaqtGeneric from '@/components/prayer/WaqtGeneric';
import { WAQT_INFO } from '@/utils/prayerContent';
import { pageMetadata } from '@/utils/seo';

type Params = Promise<{ lang: string; waqt: string }>;

// /{lang}/prayer-times/{waqt}: shows the visitor's saved city, so the content differs per
// visitor and still contains sample values. Not indexed; the city-specific pages
// (/countries/{country}/{waqt}-time-{city}) are the canonical, indexable versions.
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, waqt } = await params;
  const info = WAQT_INFO[waqt];
  if (!info) return {};
  return pageMetadata({
    lang,
    path: `/prayer-times/${waqt}`,
    title: `${info.name} Time Today – ${info.titleSuffix}`,
    description: `${info.name} prayer time today for your location: start and end time of ${info.name} namaz.`,
    index: false,
  });
}

export default async function WaqtPage({ params }: { params: Params }) {
  const { waqt } = await params;
  if (!WAQT_INFO[waqt]) notFound();
  return <WaqtGeneric waqt={waqt} />;
}
