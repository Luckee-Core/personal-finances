import type { DashboardDateRange } from '@/model/dashboard/time-period';
import { formatLocalDate } from './format-local-date';

/** Monday–Sunday week; 0 = week containing `now`, 1 = following week. */
export const getCalendarWeekRange = (
  weekOffset: number,
  now: Date = new Date(),
): DashboardDateRange => {
  const day = now.getDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - daysFromMonday + weekOffset * 7);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: formatLocalDate(monday),
    end: formatLocalDate(sunday),
  };
};

export const formatWeekRangeLabel = (range: DashboardDateRange): string => {
  const [sy, sm, sd] = range.start.split('-').map(Number);
  const [ey, em, ed] = range.end.split('-').map(Number);
  const start = new Date(sy, sm - 1, sd);
  const end = new Date(ey, em - 1, ed);
  const startFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
  const endFmt = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  if (sy === ey) {
    return `${startFmt.format(start)} – ${endFmt.format(end)}`;
  }
  return `${startFmt.format(start)}, ${sy} – ${endFmt.format(end)}`;
};

export const formatDueDateLabel = (dueOn: string): string => {
  const [y, m, d] = dueOn.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date(y, m - 1, d));
};
