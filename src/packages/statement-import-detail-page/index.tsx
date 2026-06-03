'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { STATEMENT_IMPORTS_PATH } from '@/config/routes';
import { RecategorizeFlowModal } from '@/packages/transactions/recategorize-flow-modal';
import { useAppSelector } from '@/store/hooks';
import { ImportTransactionsTable } from './import-transactions-table';

export const StatementImportDetailPage = () => {
  const router = useRouter();
  const statementImport = useAppSelector((state) => state.currentStatementImport);
  const transactions = useAppSelector((state) => Object.values(state.transactions));
  const bankAccounts = useAppSelector((state) => state.bankAccounts);
  const creditCards = useAppSelector((state) => state.creditCards);
  const [categorizeOpen, setCategorizeOpen] = useState(false);
  const [batchInfo, setBatchInfo] = useState<string | null>(null);
  const [batchError, setBatchError] = useState<string | null>(null);

  const importTransactions = useMemo(() => {
    if (!statementImport) return [];
    return transactions.filter((t) => t.statement_import_id === statementImport.id);
  }, [statementImport, transactions]);

  const uncategorizedIds = useMemo(
    () => importTransactions.filter((t) => !t.category_id).map((t) => t.id),
    [importTransactions],
  );

  const accountLabel = useMemo(() => {
    if (!statementImport) return null;
    if (statementImport.bank_account_id) {
      return bankAccounts[statementImport.bank_account_id]?.name ?? 'Bank account';
    }
    if (statementImport.credit_card_id) {
      return creditCards[statementImport.credit_card_id]?.name ?? 'Credit card';
    }
    return null;
  }, [statementImport, bankAccounts, creditCards]);

  if (!statementImport) {
    return (
      <p className={styles.empty}>
        No import selected.{' '}
        <button
          type="button"
          className={styles.emptyLink}
          onClick={() => router.push(STATEMENT_IMPORTS_PATH)}
        >
          Back to list
        </button>
      </p>
    );
  }

  const scopeLabel = `${statementImport.filename}${accountLabel ? ` · ${accountLabel}` : ''}`;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{statementImport.filename}</h1>
          <p className={`${styles.subtitle} capitalize`}>
            Status: {statementImport.status}
            {accountLabel ? ` · ${accountLabel}` : ''}
          </p>
        </div>
        <button
          type="button"
          className={styles.categorizeButton}
          disabled={uncategorizedIds.length === 0 || statementImport.status !== 'completed'}
          onClick={() => setCategorizeOpen(true)}
        >
          Categorize uncategorized
          {uncategorizedIds.length > 0 ? ` (${uncategorizedIds.length})` : ''}
        </button>
      </div>

      <dl className={styles.details}>
        <div>
          <dt className={styles.term}>Rows imported</dt>
          <dd className={styles.value}>{statementImport.rows_imported}</dd>
        </div>
        <div>
          <dt className={styles.term}>Rows skipped</dt>
          <dd className={styles.value}>{statementImport.rows_skipped}</dd>
        </div>
        <div>
          <dt className={styles.term}>Created</dt>
          <dd className={styles.value}>
            {new Date(statementImport.created_at).toLocaleString()}
          </dd>
        </div>
      </dl>

      {statementImport.error_summary && (
        <p className={styles.errorBanner}>{statementImport.error_summary}</p>
      )}
      {batchError && <p className={styles.batchError}>{batchError}</p>}
      {batchInfo && <p className={styles.batchInfo}>{batchInfo}</p>}

      <section className={styles.transactionsSection}>
        <h2 className={styles.sectionHeading}>
          Transactions ({importTransactions.length})
        </h2>
        <ImportTransactionsTable transactions={importTransactions} />
      </section>

      <RecategorizeFlowModal
        isOpen={categorizeOpen}
        onClose={() => setCategorizeOpen(false)}
        transactionIds={uncategorizedIds}
        forceAssign={false}
        scopeLabel={scopeLabel}
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
    flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between
  `,
  categorizeButton: `
    shrink-0 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800
    hover:bg-gray-50 disabled:opacity-50
  `,
  empty: `
    text-sm text-gray-600
  `,
  emptyLink: `
    underline
  `,
  title: `
    text-2xl font-semibold text-gray-900
  `,
  subtitle: `
    text-sm text-gray-600
  `,
  details: `
    grid gap-3 rounded-lg border border-gray-200 bg-white p-5
    sm:grid-cols-3
  `,
  term: `
    text-xs text-gray-500
  `,
  value: `
    text-sm font-medium
  `,
  errorBanner: `
    rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800
  `,
  batchError: `
    text-sm text-red-600
  `,
  batchInfo: `
    text-sm text-gray-600
  `,
  transactionsSection: `
    space-y-2
  `,
  sectionHeading: `
    text-lg font-semibold text-gray-900
  `,
} as const;
