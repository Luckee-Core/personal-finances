'use client';

import { RecurringPurchasesPage } from '@/packages/recurring-purchases';
import { useRegisterStaticDashboardBreadcrumbs } from '@/utils/dashboard-breadcrumbs';

export default function Page() {
  useRegisterStaticDashboardBreadcrumbs([{ label: 'Planning' }, { label: 'Recurring' }]);
  return <RecurringPurchasesPage />;
}
