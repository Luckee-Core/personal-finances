import type { BillingInterval } from '@/model/recurring-purchase';
import { formatLocalDate } from '@/utils/dashboard/format-local-date';

const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const addBillingInterval = (
  dateStr: string,
  interval: BillingInterval,
  intervalMonths: number | null,
): string => {
  const date = parseLocalDate(dateStr);
  switch (interval) {
    case 'daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
    case 'custom':
      date.setMonth(date.getMonth() + (intervalMonths ?? 1));
      break;
  }
  return formatLocalDate(date);
};
