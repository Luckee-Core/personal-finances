'use client';

import { useState } from 'react';
import { BankAccountsTable } from './table';
import { CreateBankAccountModal } from './create';

export const BankAccountsPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Bank accounts</h1>
          <p className={styles.subtitle}>
            Checking and savings accounts for manual transactions and bank CSV imports.
          </p>
        </div>
        <button type="button" onClick={() => setIsCreateOpen(true)} className={styles.primaryButton}>
          Add bank account
        </button>
      </div>
      <BankAccountsTable />
      <CreateBankAccountModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
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
