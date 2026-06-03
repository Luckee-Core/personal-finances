'use client';

import { useState } from 'react';
import { CreditCardsTable } from './table';
import { CreateCreditCardModal } from './create';

export const CreditCardsPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Credit cards</h1>
          <p className={styles.subtitle}>
            Cards used for credit card CSV statement imports.
          </p>
        </div>
        <button type="button" onClick={() => setIsCreateOpen(true)} className={styles.primaryButton}>
          Add credit card
        </button>
      </div>
      <CreditCardsTable />
      <CreateCreditCardModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
};

const styles = {
  page: `space-y-4`,
  header: `flex items-center justify-between`,
  title: `text-2xl font-semibold text-gray-900`,
  subtitle: `text-sm text-gray-600`,
  primaryButton: `rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white`,
} as const;
