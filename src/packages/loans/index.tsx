'use client';

import { useMemo, useState } from 'react';
import { LoanFormModal } from './create';
import { LoansActiveOnlyFilter } from './active-only-filter';
import { LoansTable } from './table';
import type { Loan } from '@/model/loan';
import { useAppSelector } from '@/store/hooks';
import { sumActiveLoanMonthlyCents } from '@/utils/loans';
import { formatCents } from '@/utils/format-cents';

export const LoansPage = () => {
  const loans = useAppSelector((state) => Object.values(state.loans));
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [hideInactive, setHideInactive] = useState(true);

  const { totalCents, activeLoanCount, totalBalanceCents } = useMemo(
    () => sumActiveLoanMonthlyCents(loans),
    [loans],
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Loans</h1>
          <p className={styles.subtitle}>
            Track balance, lender, and monthly payment. Active loans count toward the dashboard
            forward monthly average.
          </p>
        </div>
        <button type="button" onClick={() => setIsCreateOpen(true)} className={styles.primaryButton}>
          Add loan
        </button>
      </div>
      <div className={styles.summaryCard}>
        <p className={styles.summaryLabel}>Active loans summary</p>
        <p className={styles.summaryValue}>{formatCents(totalCents)} / month</p>
        <p className={styles.summaryMeta}>
          {activeLoanCount} loan{activeLoanCount === 1 ? '' : 's'} ·{' '}
          {formatCents(totalBalanceCents)} total balance
        </p>
      </div>
      <div className={styles.toolbar}>
        <LoansActiveOnlyFilter hideInactive={hideInactive} onHideInactiveChange={setHideInactive} />
      </div>
      <LoansTable hideInactive={hideInactive} onEdit={setEditingLoan} />
      <LoanFormModal
        isOpen={isCreateOpen || editingLoan !== null}
        loan={editingLoan}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingLoan(null);
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
  summaryCard: `rounded-lg border border-gray-200 bg-white p-5`,
  summaryLabel: `text-sm text-gray-500`,
  summaryValue: `mt-1 text-2xl font-semibold text-gray-900`,
  summaryMeta: `mt-1 text-sm text-gray-500`,
  toolbar: `flex justify-end`,
} as const;
