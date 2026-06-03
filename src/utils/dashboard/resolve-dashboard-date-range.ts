import type { DashboardDateRange, DashboardTimePeriod } from '@/model/dashboard/time-period';
import { formatLocalDate } from './format-local-date';

const monthRange = (year: number, month: number): DashboardDateRange => ({
  start: formatLocalDate(new Date(year, month, 1)),
  end: formatLocalDate(new Date(year, month + 1, 0)),
});

const quarterRange = (year: number, quarterIndex: number): DashboardDateRange => {
  const startMonth = quarterIndex * 3;
  return {
    start: formatLocalDate(new Date(year, startMonth, 1)),
    end: formatLocalDate(new Date(year, startMonth + 3, 0)),
  };
};

/**
 * Resolves inclusive local-date bounds for a dashboard time period.
 */
export const resolveDashboardDateRange = (
  period: DashboardTimePeriod,
  now: Date = new Date(),
): DashboardDateRange => {
  const year = now.getFullYear();
  const month = now.getMonth();
  const quarterIndex = Math.floor(month / 3);

  switch (period) {
    case 'this_month':
      return monthRange(year, month);
    case 'last_month':
      return monthRange(year, month - 1);
    case 'last_30_days': {
      const end = formatLocalDate(now);
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 29);
      return { start: formatLocalDate(startDate), end };
    }
    case 'this_quarter':
      return quarterRange(year, quarterIndex);
    case 'last_quarter':
      return quarterIndex === 0
        ? quarterRange(year - 1, 3)
        : quarterRange(year, quarterIndex - 1);
    case 'this_year':
      return {
        start: formatLocalDate(new Date(year, 0, 1)),
        end: formatLocalDate(new Date(year, 11, 31)),
      };
    case 'last_year':
      return {
        start: formatLocalDate(new Date(year - 1, 0, 1)),
        end: formatLocalDate(new Date(year - 1, 11, 31)),
      };
    default: {
      const _exhaustive: never = period;
      return _exhaustive;
    }
  }
};

export const isDateInDashboardRange = (
  date: string,
  range: DashboardDateRange,
): boolean => date >= range.start && date <= range.end;
