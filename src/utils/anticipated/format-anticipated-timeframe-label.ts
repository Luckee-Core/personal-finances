import type { AnticipatedTimeframeInterval } from '@/model/anticipated-cost';
import { formatDueDateLabel } from '@/utils/dashboard/get-calendar-week-range';
import { formatAnticipatedEveryLabel } from './format-anticipated-schedule-label';
import { getAnticipatedTimeframeBounds } from './get-anticipated-timeframe-bounds';

/**
 * Human-readable schedule label for table display.
 */
export const formatAnticipatedTimeframeLabel = (
  dueOn: string,
  interval: AnticipatedTimeframeInterval | null,
  count: number | null,
  every: number | null = 1,
): string => {
  if (interval == null || count == null || count < 1) {
    return formatDueDateLabel(dueOn.slice(0, 10));
  }

  const step = every != null && every >= 1 ? Math.round(every) : 1;
  const cadence = formatAnticipatedEveryLabel(interval, step);

  if (count === 1) {
    return `${cadence} · ${formatDueDateLabel(dueOn.slice(0, 10))}`;
  }

  const { start, end } = getAnticipatedTimeframeBounds(dueOn, interval, count, step);
  return `${cadence} × ${count} (${formatDueDateLabel(start)} – ${formatDueDateLabel(end)})`;
};
