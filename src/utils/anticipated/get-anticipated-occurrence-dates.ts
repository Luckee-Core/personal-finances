import type { AnticipatedTimeframeInterval } from '@/model/anticipated-cost';
import { addAnticipatedInterval } from './add-anticipated-interval';

const defaultEvery = (every: number | null | undefined): number =>
  every != null && every >= 1 ? Math.round(every) : 1;

/**
 * Payment due dates for an anticipated cost (one date, or N on the chosen schedule).
 */
export const getAnticipatedOccurrenceDates = (
  dueOn: string,
  interval: AnticipatedTimeframeInterval | null,
  count: number | null,
  every: number | null = 1,
): string[] => {
  const start = dueOn.slice(0, 10);
  if (interval == null || count == null || count < 1) {
    return [start];
  }

  const step = defaultEvery(every);
  const dates: string[] = [];
  let current = start;
  for (let i = 0; i < count; i += 1) {
    dates.push(current);
    if (i < count - 1) {
      current = addAnticipatedInterval(current, interval, step);
    }
  }
  return dates;
};
