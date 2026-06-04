'use client';

import { useState } from 'react';
import { AnticipatedCostsTable } from './table';
import { AnticipatedCostFormModal } from './create';
import { AnticipatedCostsMonthSummary } from './month-summary';
import type { AnticipatedCost } from '@/model/anticipated-cost';

export const AnticipatedCostsPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCost, setEditingCost] = useState<AnticipatedCost | null>(null);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Anticipated costs</h1>
          <p className={styles.subtitle}>
            Future expenses — one payment or a weekly / monthly / yearly schedule. Each payment
            appears on the dashboard in its due week.
          </p>
        </div>
        <button type="button" onClick={() => setIsCreateOpen(true)} className={styles.primaryButton}>
          Add anticipated cost
        </button>
      </div>
      <AnticipatedCostsMonthSummary />
      <AnticipatedCostsTable onEdit={setEditingCost} />
      <AnticipatedCostFormModal
        isOpen={isCreateOpen || editingCost !== null}
        cost={editingCost}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingCost(null);
        }}
      />
    </div>
  );
};

const styles = {
  page: `space-y-4`,
  header: `flex items-center justify-between gap-4`,
  title: `text-2xl font-semibold text-gray-900`,
  subtitle: `text-sm text-gray-600 max-w-2xl`,
  primaryButton: `rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white shrink-0`,
} as const;
