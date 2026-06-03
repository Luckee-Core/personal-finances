'use client';

import { useMemo } from 'react';
import type { RecurringPurchase } from '@/model/recurring-purchase';
import { useAppSelector } from '@/store/hooks';
import { getCalendarWeekRange } from '@/utils/dashboard/get-calendar-week-range';
import { getUpcomingChargesInRange } from '@/utils/recurring/get-upcoming-charges-in-range';
import { DashboardUpcomingWeekPanel } from './week-panel';

export const DashboardUpcomingCostsSection = () => {
  const recurring = useAppSelector((state) => Object.values(state.recurringPurchases));
  const transactions = useAppSelector((state) => Object.values(state.transactions));

  const thisWeekRange = useMemo(() => getCalendarWeekRange(0), []);
  const nextWeekRange = useMemo(() => getCalendarWeekRange(1), []);

  const thisWeekCharges = useMemo(
    () => getUpcomingChargesInRange(recurring, transactions, thisWeekRange),
    [recurring, transactions, thisWeekRange],
  );

  const nextWeekCharges = useMemo(
    () => getUpcomingChargesInRange(recurring, transactions, nextWeekRange),
    [recurring, transactions, nextWeekRange],
  );

  const recurringById = useMemo(() => {
    const map: Record<string, RecurringPurchase> = {};
    for (const purchase of recurring) {
      map[purchase.id] = purchase;
    }
    return map;
  }, [recurring]);

  return (
    <section className={styles.section}>
      <div>
        <h2 className={styles.heading}>Upcoming costs</h2>
        <p className={styles.subheading}>
          Anticipated recurring charges (Monday–Sunday), based on billing interval and linked
          transactions.
        </p>
      </div>
      <div className={styles.grid}>
        <DashboardUpcomingWeekPanel
          title="This week"
          range={thisWeekRange}
          charges={thisWeekCharges}
          recurringById={recurringById}
        />
        <DashboardUpcomingWeekPanel
          title="Next week"
          range={nextWeekRange}
          charges={nextWeekCharges}
          recurringById={recurringById}
        />
      </div>
    </section>
  );
};

const styles = {
  section: `
    space-y-3
  `,
  heading: `
    text-lg font-semibold text-gray-900
  `,
  subheading: `
    text-sm text-gray-500
  `,
  grid: `
    grid gap-4
    lg:grid-cols-2
  `,
} as const;
