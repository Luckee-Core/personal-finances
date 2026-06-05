'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { TransactionsTable } from './table';
import { CreateTransactionModal } from './create';
import { RecategorizeFlowModal } from './recategorize-flow-modal';
import { assignTransactionSlugsBatchThunk } from '@/store/thunks/transactions';

export const TransactionsPage = () => {
  const dispatch = useAppDispatch();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isBatchAssigningSlugs, setIsBatchAssigningSlugs] = useState(false);
  const [batchError, setBatchError] = useState<string | null>(null);
  const [batchInfo, setBatchInfo] = useState<string | null>(null);
  const [categorizeOpen, setCategorizeOpen] = useState(false);

  const handleBatchAssignSlugs = async () => {
    setBatchError(null);
    setBatchInfo(null);
    setIsBatchAssigningSlugs(true);
    const result = await dispatch(
      assignTransactionSlugsBatchThunk({ only_unslagged: true }),
    );
    setIsBatchAssigningSlugs(false);
    if (result.status !== 200) {
      setBatchError(result.message);
      return;
    }
    if (result.message) {
      setBatchInfo(result.message);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Transactions</h1>
          <p className={styles.subtitle}>Manual entries and imported bank activity.</p>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            onClick={() => setCategorizeOpen(true)}
            disabled={isBatchAssigningSlugs}
            className={styles.secondaryButton}
          >
            Categorize all
          </button>
          <button
            type="button"
            onClick={() => void handleBatchAssignSlugs()}
            disabled={isBatchAssigningSlugs}
            className={styles.secondaryButton}
          >
            {isBatchAssigningSlugs ? 'Assigning slugs…' : 'Assign slugs (unassigned)'}
          </button>
          <button type="button" onClick={() => setIsCreateOpen(true)} className={styles.primaryButton}>
            Add transaction
          </button>
        </div>
      </div>
      {batchError && <p className={styles.batchError}>{batchError}</p>}
      {batchInfo && <p className={styles.batchInfo}>{batchInfo}</p>}
      <TransactionsTable />
      <CreateTransactionModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <RecategorizeFlowModal
        isOpen={categorizeOpen}
        onClose={() => setCategorizeOpen(false)}
        categorizeAll
        scopeLabel="All transactions"
        onComplete={(message, error) => {
          setBatchInfo(message);
          setBatchError(error);
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
  title: `
    text-2xl font-semibold text-gray-900
  `,
  subtitle: `
    text-sm text-gray-600
  `,
  primaryButton: `
    rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white
  `,
  secondaryButton: `
    rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800
    hover:bg-gray-50 disabled:opacity-50
  `,
  batchError: `
    text-sm text-red-600
  `,
  batchInfo: `
    text-sm text-gray-600
  `,
} as const;
