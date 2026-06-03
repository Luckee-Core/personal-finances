'use client';

import {
  DASHBOARD_TIME_PERIOD_OPTIONS,
  type DashboardTimePeriod,
} from '@/model/dashboard/time-period';
import { DashboardBuilderActions } from '@/store/builders';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const isDashboardTimePeriod = (value: string): value is DashboardTimePeriod =>
  DASHBOARD_TIME_PERIOD_OPTIONS.some((option) => option.value === value);

export const DashboardPeriodFilter = () => {
  const dispatch = useAppDispatch();
  const timePeriod = useAppSelector((state) => state.dashboardBuilder.timePeriod);

  return (
    <div className={styles.row}>
      <label htmlFor="dashboard-time-period" className={styles.label}>
        Time period
      </label>
      <select
        id="dashboard-time-period"
        className={styles.select}
        value={timePeriod}
        onChange={(e) => {
          const next = e.target.value;
          if (isDashboardTimePeriod(next)) {
            dispatch(DashboardBuilderActions.setTimePeriod(next));
          }
        }}
      >
        {DASHBOARD_TIME_PERIOD_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const styles = {
  row: `
    flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3
  `,
  label: `
    text-sm font-medium text-gray-700
  `,
  select: `
    rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900
  `,
} as const;
