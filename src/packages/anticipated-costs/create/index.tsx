'use client';

import { useEffect, useState } from 'react';
import { createAnticipatedCostThunk } from '@/store/thunks/anticipated-costs/create-anticipated-cost-thunk';
import { updateAnticipatedCostThunk } from '@/store/thunks/anticipated-costs/update-anticipated-cost-thunk';
import { useAppDispatch } from '@/store/hooks';
import { formatAnticipatedEveryLabel } from '@/utils/anticipated';
import {
  ANTICIPATED_COST_STATUS_OPTIONS,
  ANTICIPATED_TIMEFRAME_INTERVAL_OPTIONS,
  MAX_ANTICIPATED_TIMEFRAME_COUNT,
  MAX_ANTICIPATED_TIMEFRAME_EVERY,
  MIN_ANTICIPATED_TIMEFRAME_COUNT,
  MIN_ANTICIPATED_TIMEFRAME_EVERY,
  type AnticipatedCost,
  type AnticipatedCostStatus,
  type AnticipatedTimeframeInterval,
} from '@/model/anticipated-cost';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  cost?: AnticipatedCost | null;
};

const intervalLabels: Record<AnticipatedTimeframeInterval, string> = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

export const AnticipatedCostFormModal = ({ isOpen, onClose, cost }: Props) => {
  const dispatch = useAppDispatch();
  const isEdit = cost != null;
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueOn, setDueOn] = useState('');
  const [notes, setNotes] = useState('');
  const [hasSchedule, setHasSchedule] = useState(false);
  const [timeframeInterval, setTimeframeInterval] =
    useState<AnticipatedTimeframeInterval>('monthly');
  const [timeframeEvery, setTimeframeEvery] = useState('1');
  const [timeframeCount, setTimeframeCount] = useState('12');
  const [status, setStatus] = useState<AnticipatedCostStatus>('planned');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (cost) {
      setName(cost.name);
      setAmount(String(cost.amount_cents / 100));
      setDueOn(cost.due_on.slice(0, 10));
      setNotes(cost.notes ?? '');
      setStatus(cost.status);
      const hasWindow =
        cost.timeframe_interval != null && cost.timeframe_count != null;
      setHasSchedule(hasWindow);
      if (hasWindow && cost.timeframe_interval != null && cost.timeframe_count != null) {
        setTimeframeInterval(cost.timeframe_interval);
        setTimeframeEvery(String(cost.timeframe_every ?? 1));
        setTimeframeCount(String(cost.timeframe_count));
      } else {
        setTimeframeInterval('monthly');
        setTimeframeEvery('1');
        setTimeframeCount('12');
      }
    } else {
      setName('');
      setAmount('');
      setDueOn('');
      setNotes('');
      setStatus('planned');
      setHasSchedule(false);
      setTimeframeInterval('monthly');
      setTimeframeEvery('1');
      setTimeframeCount('12');
    }
    setError('');
  }, [isOpen, cost]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setError('');
    const amountCents = Math.round(Number(amount) * 100);
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!Number.isFinite(amountCents) || amountCents < 0) {
      setError('Enter a valid amount');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dueOn)) {
      setError('Enter a valid due date');
      return;
    }

    let interval: AnticipatedTimeframeInterval | null = null;
    let every: number | null = null;
    let count: number | null = null;
    if (hasSchedule) {
      const parsedEvery = Math.round(Number(timeframeEvery));
      const parsedCount = Math.round(Number(timeframeCount));
      if (
        !Number.isFinite(parsedEvery) ||
        parsedEvery < MIN_ANTICIPATED_TIMEFRAME_EVERY ||
        parsedEvery > MAX_ANTICIPATED_TIMEFRAME_EVERY
      ) {
        setError(
          `Enter "every" between ${MIN_ANTICIPATED_TIMEFRAME_EVERY} and ${MAX_ANTICIPATED_TIMEFRAME_EVERY}`,
        );
        return;
      }
      if (
        !Number.isFinite(parsedCount) ||
        parsedCount < MIN_ANTICIPATED_TIMEFRAME_COUNT ||
        parsedCount > MAX_ANTICIPATED_TIMEFRAME_COUNT
      ) {
        setError(
          `Enter count between ${MIN_ANTICIPATED_TIMEFRAME_COUNT} and ${MAX_ANTICIPATED_TIMEFRAME_COUNT}`,
        );
        return;
      }
      interval = timeframeInterval;
      every = parsedEvery;
      count = parsedCount;
    }

    setIsSaving(true);
    const payload = {
      name: name.trim(),
      amount_cents: amountCents,
      due_on: dueOn,
      notes: notes.trim() || null,
      timeframe_interval: interval,
      timeframe_every: every,
      timeframe_count: count,
      status,
    };
    const result = isEdit
      ? await dispatch(updateAnticipatedCostThunk(cost.id, payload))
      : await dispatch(createAnticipatedCostThunk(payload));
    setIsSaving(false);
    if (result.status !== 200) {
      setError(result.message);
      return;
    }
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <h2 className={styles.heading}>
          {isEdit ? 'Edit anticipated cost' : 'New anticipated cost'}
        </h2>
        <p className={styles.hint}>
          Set amount and first due date. Add a schedule for weekly, monthly, or yearly payments.
        </p>
        <div className={styles.fields}>
          <input
            type="text"
            placeholder="Name (e.g. Rent)"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Amount per payment (USD)"
            className={styles.input}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div>
            <label className={styles.fieldLabel} htmlFor="anticipated-due-on">
              First due date
            </label>
            <input
              id="anticipated-due-on"
              type="date"
              className={styles.input}
              value={dueOn}
              onChange={(e) => setDueOn(e.target.value)}
            />
          </div>
          <fieldset className={styles.timeframeFieldset}>
            <legend className={styles.timeframeLegend}>Schedule</legend>
            <label className={styles.radioRow}>
              <input
                type="radio"
                name="schedule-mode"
                checked={!hasSchedule}
                onChange={() => setHasSchedule(false)}
              />
              <span>One payment on that date</span>
            </label>
            <label className={styles.radioRow}>
              <input
                type="radio"
                name="schedule-mode"
                checked={hasSchedule}
                onChange={() => setHasSchedule(true)}
              />
              <span>Repeats on an interval</span>
            </label>
            {hasSchedule && (
              <div className={styles.scheduleFields}>
                <div className={styles.everyRow}>
                  <span className={styles.everyPrefix}>Every</span>
                  <input
                    id="anticipated-every"
                    type="number"
                    min={MIN_ANTICIPATED_TIMEFRAME_EVERY}
                    max={MAX_ANTICIPATED_TIMEFRAME_EVERY}
                    className={styles.everyInput}
                    value={timeframeEvery}
                    onChange={(e) => setTimeframeEvery(e.target.value)}
                  />
                  <select
                    id="anticipated-interval"
                    className={styles.everySelect}
                    value={timeframeInterval}
                    onChange={(e) =>
                      setTimeframeInterval(e.target.value as AnticipatedTimeframeInterval)
                    }
                  >
                    {ANTICIPATED_TIMEFRAME_INTERVAL_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {intervalLabels[option]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={styles.fieldLabel} htmlFor="anticipated-count">
                    Number of payments
                  </label>
                  <input
                    id="anticipated-count"
                    type="number"
                    min={MIN_ANTICIPATED_TIMEFRAME_COUNT}
                    max={MAX_ANTICIPATED_TIMEFRAME_COUNT}
                    className={styles.input}
                    value={timeframeCount}
                    onChange={(e) => setTimeframeCount(e.target.value)}
                  />
                </div>
                <p className={styles.scheduleHint}>
                  {formatAnticipatedEveryLabel(timeframeInterval, Number(timeframeEvery) || 1)} ×{' '}
                  {timeframeCount || '—'} payments from the first due date. Use 2 or 3 for
                  bi-weekly or quarterly-style schedules.
                </p>
              </div>
            )}
          </fieldset>
          {isEdit && (
            <select
              className={styles.input}
              value={status}
              onChange={(e) => setStatus(e.target.value as AnticipatedCostStatus)}
            >
              {ANTICIPATED_COST_STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
          <textarea
            placeholder="Notes (optional)"
            className={styles.textarea}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          <button type="button" onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={isSaving}
            className={styles.saveButton}
          >
            {isSaving ? 'Saving…' : isEdit ? 'Save' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: `
    fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4
  `,
  panel: `
    w-full max-w-md rounded-lg bg-white p-6 shadow-lg
  `,
  heading: `
    text-lg font-semibold text-gray-900
  `,
  hint: `
    mt-1 text-sm text-gray-500
  `,
  fields: `
    mt-4 space-y-3
  `,
  fieldLabel: `
    block text-xs font-medium text-gray-600 mb-1
  `,
  input: `
    w-full rounded-md border border-gray-300 px-3 py-2 text-sm
  `,
  timeframeFieldset: `
    rounded-md border border-gray-200 px-3 py-3 space-y-2
  `,
  timeframeLegend: `
    text-xs font-semibold text-gray-700 px-1
  `,
  radioRow: `
    flex items-center gap-2 text-sm text-gray-700
  `,
  scheduleFields: `
    pl-6 space-y-3
  `,
  everyRow: `
    flex flex-wrap items-center gap-2
  `,
  everyPrefix: `
    text-sm font-medium text-gray-700
  `,
  everyInput: `
    w-16 rounded-md border border-gray-300 px-2 py-2 text-sm
  `,
  everySelect: `
    rounded-md border border-gray-300 px-2 py-2 text-sm
  `,
  scheduleHint: `
    text-xs text-gray-500
  `,
  textarea: `
    w-full rounded-md border border-gray-300 px-3 py-2 text-sm
  `,
  error: `
    mt-2 text-sm text-red-600
  `,
  actions: `
    mt-6 flex justify-end gap-2
  `,
  cancelButton: `
    rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700
  `,
  saveButton: `
    rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white disabled:opacity-50
  `,
} as const;
