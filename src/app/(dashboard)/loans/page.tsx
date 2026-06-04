'use client';

import { LoansPage } from '@/packages/loans';
import { useRegisterStaticDashboardBreadcrumbs } from '@/utils/dashboard-breadcrumbs';

export default function Page() {
  useRegisterStaticDashboardBreadcrumbs([{ label: 'Planning' }, { label: 'Loans' }]);
  return <LoansPage />;
}
