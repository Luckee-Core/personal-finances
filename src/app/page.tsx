import type { Metadata } from 'next';
import { MarketingLanding } from '@/packages/landing';

export const metadata: Metadata = {
  title: 'Personal Finances — Open-source, self-hostable finance tracker',
  description:
    'Import bank and credit CSVs, categorize with your own AI prompts, and track recurring bills, loans, and planned costs. Next.js + Express + Supabase. MIT.',
  openGraph: {
    title: 'Personal Finances — Open-source finance tracker',
    description:
      'Self-hostable personal finance app with AI-assisted categorization. Your stack, your data.',
    type: 'website',
  },
};

export default function Page() {
  return <MarketingLanding />;
}
