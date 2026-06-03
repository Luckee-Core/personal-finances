'use client';

import { StatementImportsPage } from '@/packages/statement-imports';
import { useRegisterStaticDashboardBreadcrumbs } from '@/utils/dashboard-breadcrumbs';

export default function Page() {
  useRegisterStaticDashboardBreadcrumbs([{ label: 'Data' }, { label: 'Imports' }]);
  return <StatementImportsPage />;
}
