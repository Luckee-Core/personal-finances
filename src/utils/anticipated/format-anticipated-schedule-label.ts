import type { AnticipatedTimeframeInterval } from '@/model/anticipated-cost';

const unitLabels: Record<AnticipatedTimeframeInterval, { one: string; many: string }> = {
  weekly: { one: 'week', many: 'weeks' },
  monthly: { one: 'month', many: 'months' },
  yearly: { one: 'year', many: 'years' },
};

/**
 * e.g. "every 2 months", "every week", "every 3 years"
 */
export const formatAnticipatedEveryLabel = (
  interval: AnticipatedTimeframeInterval,
  every: number,
): string => {
  const step = Math.max(1, Math.round(every));
  const units = unitLabels[interval];
  if (step === 1) {
    return `every ${units.one}`;
  }
  return `every ${step} ${units.many}`;
};
