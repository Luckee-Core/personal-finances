import { getAnticipatedOccurrenceDates } from './get-anticipated-occurrence-dates';
import type { AnticipatedTimeframeInterval } from '@/model/anticipated-cost';

export type AnticipatedTimeframeBounds = {
  start: string;
  end: string;
};

const compareDates = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

/**
 * Inclusive start/end dates across all anticipated payment dates.
 */
export const getAnticipatedTimeframeBounds = (
  dueOn: string,
  interval: AnticipatedTimeframeInterval | null,
  count: number | null,
  every: number | null = 1,
): AnticipatedTimeframeBounds => {
  const dates = getAnticipatedOccurrenceDates(dueOn, interval, count, every);
  return { start: dates[0], end: dates[dates.length - 1] };
};

/**
 * True when a calendar week range contains at least one anticipated payment date.
 */
export const anticipatedTimeframeOverlapsRange = (
  dueOn: string,
  interval: AnticipatedTimeframeInterval | null,
  count: number | null,
  rangeStart: string,
  rangeEnd: string,
  every: number | null = 1,
): boolean => {
  const dates = getAnticipatedOccurrenceDates(dueOn, interval, count, every);
  return dates.some(
    (date) => compareDates(date, rangeStart) >= 0 && compareDates(date, rangeEnd) <= 0,
  );
};

/**
 * True when a specific payment date falls inside the calendar week.
 */
export const anticipatedDueOnInRange = (
  paymentDate: string,
  rangeStart: string,
  rangeEnd: string,
): boolean => {
  const due = paymentDate.slice(0, 10);
  return compareDates(due, rangeStart) >= 0 && compareDates(due, rangeEnd) <= 0;
};
