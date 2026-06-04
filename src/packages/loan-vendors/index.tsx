'use client';

import { useState } from 'react';
import type { LoanVendor } from '@/model/loan-vendor';
import { LoanVendorFormModal } from './form-modal';
import { LoanVendorsTable } from './table';

export const LoanVendorsPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<LoanVendor | null>(null);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Loan vendors</h1>
          <p className={styles.subtitle}>
            Lenders used on loans. You can also add lenders when creating or editing a loan.
          </p>
        </div>
        <button type="button" onClick={() => setIsCreateOpen(true)} className={styles.primaryButton}>
          Add lender
        </button>
      </div>
      <LoanVendorsTable onEdit={setEditingVendor} />
      <LoanVendorFormModal
        isOpen={isCreateOpen || editingVendor !== null}
        vendor={editingVendor}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingVendor(null);
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
