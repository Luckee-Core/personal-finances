'use client';

import { BankAccountsPage } from '@/packages/bank-accounts';
import { useRegisterStaticDashboardBreadcrumbs } from '@/utils/dashboard-breadcrumbs';

export default function Page() {
  useRegisterStaticDashboardBreadcrumbs([{ label: 'Data' }, { label: 'Bank accounts' }]);
  return <BankAccountsPage />;
}
