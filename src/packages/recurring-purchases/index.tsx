'use client';

import { useState } from 'react';
import { RecurringPurchasesTable } from './table';
import { RecurringPurchaseFormModal } from './create';
import type { RecurringPurchase } from '@/model/recurring-purchase';
import { useAppDispatch } from '@/store/hooks';
import { detectRecurringPurchasesThunk } from '@/store/thunks/recurring-purchases/detect-recurring-purchases-thunk';

export const RecurringPurchasesPage = () => {
  const dispatch = useAppDispatch();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<RecurringPurchase | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectError, setDetectError] = useState<string | null>(null);
  const [detectInfo, setDetectInfo] = useState<string | null>(null);

  const handleDetect = async () => {
    setDetectError(null);
    setDetectInfo(null);
    setIsDetecting(true);
    const result = await dispatch(
      detectRecurringPurchasesThunk({
        only_unlinked: true,
        create_recurring: true,
        min_transactions: 2,
      }),
    );
    setIsDetecting(false);
    if (result.status !== 200) {
      setDetectError(result.message);
      return;
    }
    if (result.message) {
      setDetectInfo(result.message);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Recurring purchases</h1>
          <p className={styles.subtitle}>
            Subscriptions and scheduled bills. Detect uses one AI pass over all slugged
            transactions (date, description, slug, amount).
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            onClick={() => void handleDetect()}
            disabled={isDetecting}
            className={styles.secondaryButton}
          >
            {isDetecting ? 'Detecting… (1–3 min)' : 'Detect recurring (AI)'}
          </button>
          <button type="button" onClick={() => setIsCreateOpen(true)} className={styles.primaryButton}>
            Add recurring
          </button>
        </div>
      </div>
      {detectError && <p className={styles.detectError}>{detectError}</p>}
      {detectInfo && <p className={styles.detectInfo}>{detectInfo}</p>}
      <RecurringPurchasesTable onEdit={setEditingPurchase} />
      <RecurringPurchaseFormModal
        isOpen={isCreateOpen || editingPurchase !== null}
        purchase={editingPurchase}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingPurchase(null);
        }}
      />
    </div>
  );
};

const styles = {
  page: `
    space-y-4
  `,
  header: `
    flex items-center justify-between
  `,
  headerActions: `
    flex items-center gap-2
  `,
  secondaryButton: `
    rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800
    hover:bg-gray-50 disabled:opacity-50
  `,
  detectError: `
    text-sm text-red-600
  `,
  detectInfo: `
    text-sm text-gray-600
  `,
  title: `
    text-2xl font-semibold text-gray-900
  `,
  subtitle: `
    text-sm text-gray-600
  `,
  primaryButton: `
    rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white
  `,
} as const;
