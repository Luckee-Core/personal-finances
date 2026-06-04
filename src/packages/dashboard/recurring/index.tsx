'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RECURRING_PATH } from '@/config/routes';
import { DashboardRecurringActiveOnlyFilter } from './active-only-filter';
import { DashboardRecurringTable } from './table';

export const DashboardRecurringSection = () => {
  const [hideInactive, setHideInactive] = useState(true);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.heading}>Recurring</h2>
          <p className={styles.subheading}>
            Active subscriptions and bills.{' '}
            <Link href={RECURRING_PATH} className={styles.link}>
              Manage recurring →
            </Link>
          </p>
        </div>
        <DashboardRecurringActiveOnlyFilter
          hideInactive={hideInactive}
          onHideInactiveChange={setHideInactive}
        />
      </div>
      <DashboardRecurringTable hideInactive={hideInactive} />
    </section>
  );
};

const styles = {
  section: `
    space-y-3
  `,
  header: `
    flex flex-col gap-3
    sm:flex-row sm:items-end sm:justify-between
  `,
  heading: `
    text-lg font-semibold text-gray-900
  `,
  subheading: `
    text-sm text-gray-500
  `,
  link: `
    text-gray-700 underline hover:text-gray-900
  `,
} as const;
