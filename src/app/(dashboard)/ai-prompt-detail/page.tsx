'use client';

import { AiPromptDetailPage } from '@/packages/ai-prompt-detail';
import { AI_PROMPTS_PATH } from '@/config/routes';
import { useRegisterStaticDashboardBreadcrumbs } from '@/utils/dashboard-breadcrumbs';
import { useAppSelector } from '@/store/hooks';

export default function Page() {
  const prompt = useAppSelector((state) => state.currentAiPrompt);
  useRegisterStaticDashboardBreadcrumbs([
    { label: 'AI Prompts', href: AI_PROMPTS_PATH },
    { label: prompt?.name ?? 'Detail' },
  ]);
  return <AiPromptDetailPage />;
}
