'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { ANTICIPATED_COSTS_PATH } from '@/config/routes';
import type { RecurringPurchase } from '@/model/recurring-purchase';
import { useAppSelector } from '@/store/hooks';
import { getPlannedAnticipatedInRange } from '@/utils/anticipated/get-planned-anticipated-in-range';
import { getCalendarWeekRange } from '@/utils/dashboard/get-calendar-week-range';
import { mergeDashboardUpcomingItems } from '@/utils/dashboard/merge-dashboard-upcoming-items';
import { getUpcomingChargesInRange } from '@/utils/recurring/get-upcoming-charges-in-range';
import { DashboardUpcomingWeekPanel } from './week-panel';

export const DashboardUpcomingCostsSection = () => {
  const recurring = useAppSelector((state) => Object.values(state.recurringPurchases));
  const anticipated = useAppSelector((state) => Object.values(state.anticipatedCosts));
  const transactions = useAppSelector((state) => Object.values(state.transactions));

  const thisWeekRange = useMemo(() => getCalendarWeekRange(0), []);
  const nextWeekRange = useMemo(() => getCalendarWeekRange(1), []);

  const thisWeekItems = useMemo(() => {
    const recurringCharges = getUpcomingChargesInRange(recurring, transactions, thisWeekRange);
    const plannedCharges = getPlannedAnticipatedInRange(anticipated, thisWeekRange);
    return mergeDashboardUpcomingItems(
      recurringCharges,
      plannedCharges,
      thisWeekRange.start,
    );
  }, [recurring, anticipated, transactions, thisWeekRange]);

  const nextWeekItems = useMemo(() => {
    const recurringCharges = getUpcomingChargesInRange(recurring, transactions, nextWeekRange);
    const plannedCharges = getPlannedAnticipatedInRange(anticipated, nextWeekRange);
    return mergeDashboardUpcomingItems(
      recurringCharges,
      plannedCharges,
      nextWeekRange.start,
    );
  }, [recurring, anticipated, transactions, nextWeekRange]);

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
          Recurring bills and{' '}
          <Link href={ANTICIPATED_COSTS_PATH} className={styles.link}>
            planned anticipated costs
          </Link>{' '}
          due this week and next (Monday–Sunday).
        </p>
      </div>
      <div className={styles.grid}>
        <DashboardUpcomingWeekPanel
          title="This week"
          range={thisWeekRange}
          items={thisWeekItems}
          recurringById={recurringById}
        />
        <DashboardUpcomingWeekPanel
          title="Next week"
          range={nextWeekRange}
          items={nextWeekItems}
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
  link: `
    text-gray-700 underline hover:text-gray-900
  `,
  grid: `
    grid gap-4
    lg:grid-cols-2
  `,
} as const;
