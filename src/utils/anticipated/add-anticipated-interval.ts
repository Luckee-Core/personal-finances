import type { AnticipatedTimeframeInterval } from '@/model/anticipated-cost';
import { formatLocalDate } from '@/utils/dashboard/format-local-date';

const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Advances a local date by N units of the given interval (e.g. every 2 months).
 */
export const addAnticipatedInterval = (
  dateStr: string,
  interval: AnticipatedTimeframeInterval,
  every: number,
): string => {
  const steps = Math.max(1, Math.round(every));
  const date = parseLocalDate(dateStr.slice(0, 10));

  switch (interval) {
    case 'weekly':
      date.setDate(date.getDate() + steps * 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + steps);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + steps);
      break;
  }

  return formatLocalDate(date);
};
