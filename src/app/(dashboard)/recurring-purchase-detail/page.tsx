'use client';

import { RecurringPurchaseDetailPage } from '@/packages/recurring-purchase-detail-page';
import { RECURRING_PATH } from '@/config/routes';
import { useRegisterStaticDashboardBreadcrumbs } from '@/utils/dashboard-breadcrumbs';
import { useAppSelector } from '@/store/hooks';

export default function Page() {
  const purchase = useAppSelector((state) => state.currentRecurringPurchase);
  useRegisterStaticDashboardBreadcrumbs([
    { label: 'Recurring', href: RECURRING_PATH },
    { label: purchase?.name ?? 'Detail' },
  ]);
  return <RecurringPurchaseDetailPage />;
}
