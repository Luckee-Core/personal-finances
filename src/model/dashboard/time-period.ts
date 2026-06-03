export type DashboardTimePeriod =
  | 'this_month'
  | 'last_month'
  | 'last_30_days'
  | 'this_quarter'
  | 'last_quarter'
  | 'this_year'
  | 'last_year';

export type DashboardDateRange = {
  start: string;
  end: string;
};

export const DASHBOARD_TIME_PERIOD_OPTIONS: ReadonlyArray<{
  value: DashboardTimePeriod;
  label: string;
}> = [
  { value: 'this_month', label: 'This month' },
  { value: 'last_month', label: 'Last month' },
  { value: 'last_30_days', label: 'Last 30 days' },
  { value: 'this_quarter', label: 'This quarter' },
  { value: 'last_quarter', label: 'Last quarter' },
  { value: 'this_year', label: 'This year' },
  { value: 'last_year', label: 'Last year' },
] as const;

export const getDashboardTimePeriodLabel = (period: DashboardTimePeriod): string =>
  DASHBOARD_TIME_PERIOD_OPTIONS.find((o) => o.value === period)?.label ?? period;
