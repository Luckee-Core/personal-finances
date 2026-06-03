'use client';

import { AiPromptsPage } from '@/packages/ai-prompts';
import { useRegisterStaticDashboardBreadcrumbs } from '@/utils/dashboard-breadcrumbs';

export default function Page() {
  useRegisterStaticDashboardBreadcrumbs([
    { label: 'Settings' },
    { label: 'AI Prompts' },
  ]);
  return <AiPromptsPage />;
}
