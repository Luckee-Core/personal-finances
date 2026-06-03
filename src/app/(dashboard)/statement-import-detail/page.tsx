'use client';

import { StatementImportDetailPage } from '@/packages/statement-import-detail-page';
import { STATEMENT_IMPORTS_PATH } from '@/config/routes';
import { useRegisterStaticDashboardBreadcrumbs } from '@/utils/dashboard-breadcrumbs';
import { useAppSelector } from '@/store/hooks';

export default function Page() {
  const statementImport = useAppSelector((state) => state.currentStatementImport);
  useRegisterStaticDashboardBreadcrumbs([
    { label: 'Imports', href: STATEMENT_IMPORTS_PATH },
    { label: statementImport?.filename ?? 'Detail' },
  ]);
  return <StatementImportDetailPage />;
}
