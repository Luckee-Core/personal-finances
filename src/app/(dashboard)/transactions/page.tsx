'use client';

import { TransactionsPage } from '@/packages/transactions';
import { useRegisterStaticDashboardBreadcrumbs } from '@/utils/dashboard-breadcrumbs';

export default function Page() {
  useRegisterStaticDashboardBreadcrumbs([{ label: 'Activity' }, { label: 'Transactions' }]);
  return <TransactionsPage />;
}
