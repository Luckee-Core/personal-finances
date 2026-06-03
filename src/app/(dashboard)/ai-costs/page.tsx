'use client';

import { AiCostsPage } from '@/packages/ai-costs';
import { useRegisterStaticDashboardBreadcrumbs } from '@/utils/dashboard-breadcrumbs';

export default function Page() {
  useRegisterStaticDashboardBreadcrumbs([{ label: 'Settings' }, { label: 'AI Costs' }]);
  return <AiCostsPage />;
}
