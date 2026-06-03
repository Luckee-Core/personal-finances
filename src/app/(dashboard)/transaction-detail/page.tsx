'use client';

import { TransactionDetailPage } from '@/packages/transaction-detail-page';
import { TRANSACTIONS_PATH } from '@/config/routes';
import { useRegisterStaticDashboardBreadcrumbs } from '@/utils/dashboard-breadcrumbs';
import { useAppSelector } from '@/store/hooks';

export default function Page() {
  const transaction = useAppSelector((state) => state.currentTransaction);
  useRegisterStaticDashboardBreadcrumbs([
    { label: 'Transactions', href: TRANSACTIONS_PATH },
    { label: transaction?.description ?? 'Detail' },
  ]);
  return <TransactionDetailPage />;
}
