'use client';

import { CreditCardsPage } from '@/packages/credit-cards';
import { useRegisterStaticDashboardBreadcrumbs } from '@/utils/dashboard-breadcrumbs';

export default function Page() {
  useRegisterStaticDashboardBreadcrumbs([{ label: 'Data' }, { label: 'Credit cards' }]);
  return <CreditCardsPage />;
}
