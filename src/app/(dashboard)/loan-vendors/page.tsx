'use client';

import { LoanVendorsPage } from '@/packages/loan-vendors';
import { useRegisterStaticDashboardBreadcrumbs } from '@/utils/dashboard-breadcrumbs';

export default function Page() {
  useRegisterStaticDashboardBreadcrumbs([{ label: 'Planning' }, { label: 'Loan vendors' }]);
  return <LoanVendorsPage />;
}
