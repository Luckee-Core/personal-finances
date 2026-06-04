import type { DashboardDateRange } from '@/model/dashboard/time-period';
import { formatLocalDate } from './format-local-date';

/**
 * Inclusive local-date bounds for a calendar month (0 = current month).
 */
export const getCalendarMonthRange = (monthOffset = 0): DashboardDateRange => {
  const anchor = new Date();
  const year = anchor.getFullYear();
  const month = anchor.getMonth() + monthOffset;
  return {
    start: formatLocalDate(new Date(year, month, 1)),
    end: formatLocalDate(new Date(year, month + 1, 0)),
  };
};

/**
 * Label for a calendar month (0 = current month).
 */
export const formatCalendarMonthLabel = (monthOffset = 0): string => {
  const anchor = new Date();
  const date = new Date(anchor.getFullYear(), anchor.getMonth() + monthOffset, 1);
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
};
