'use client';

import { AnticipatedCostsPage } from '@/packages/anticipated-costs';
import { useRegisterStaticDashboardBreadcrumbs } from '@/utils/dashboard-breadcrumbs';

export default function Page() {
  useRegisterStaticDashboardBreadcrumbs([
    { label: 'Planning' },
    { label: 'Anticipated costs' },
  ]);
  return <AnticipatedCostsPage />;
}
