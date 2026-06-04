'use client';

import { DashboardCategoriesSection } from './categories';
import { DashboardForwardMonthlyCard } from './forward-monthly';
import { DashboardMonthlySpendCard } from './monthly';
import { DashboardPeriodFilter } from './period-filter';
import { DashboardRecurringSection } from './recurring';
import { DashboardTransactionsSection } from './transactions';
import { DashboardUpcomingCostsSection } from './upcoming-costs';

export const DashboardPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>
            Spending overview, forward monthly average, and upcoming commitments.
          </p>
        </div>
        <DashboardPeriodFilter />
      </div>
      <div className={styles.cardGrid}>
        <DashboardMonthlySpendCard />
        <DashboardForwardMonthlyCard />
      </div>
      <DashboardRecurringSection />
      <DashboardUpcomingCostsSection />
      <DashboardCategoriesSection />
      <DashboardTransactionsSection />
    </div>
  );
};

const styles = {
  page: `
    space-y-6
  `,
  header: `
    flex flex-col gap-4
    sm:flex-row sm:items-end sm:justify-between
  `,
  title: `
    text-2xl font-semibold text-gray-900
  `,
  subtitle: `
    text-sm text-gray-600
  `,
  cardGrid: `
    grid gap-4
    sm:grid-cols-2
  `,
} as const;
