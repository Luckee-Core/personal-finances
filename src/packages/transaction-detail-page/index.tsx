'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TRANSACTIONS_PATH } from '@/config/routes';
import { deleteTransactionThunk } from '@/store/thunks/transactions/delete-transaction-thunk';
import { loadTransactionSlugAssignAuditThunk } from '@/store/thunks/transactions/load-transaction-slug-assign-audit-thunk';
import { TransactionCategoryCombobox } from '@/packages/categories/transaction-category-combobox';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { formatCents } from '@/utils/format-cents';
import { getTransactionAccountName } from '@/utils/transactions';
import { RecategorizeFlowModal } from '@/packages/transactions/recategorize-flow-modal';
import { ReslugFlowModal } from '@/packages/transactions/reslug-flow-modal';

export const TransactionDetailPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const transaction = useAppSelector((state) => state.currentTransaction);
  const bankAccounts = useAppSelector((state) => state.bankAccounts);
  const creditCards = useAppSelector((state) => state.creditCards);
  const exchanges = useAppSelector((state) => state.transactionSlugAssignAiExchanges);
  const responses = useAppSelector((state) => state.transactionSlugAssignAiResponses);
  const [recategorizeOpen, setRecategorizeOpen] = useState(false);
  const [reslugOpen, setReslugOpen] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  useEffect(() => {
    if (transaction?.id) {
      void dispatch(loadTransactionSlugAssignAuditThunk(transaction.id));
    }
  }, [dispatch, transaction?.id]);

  const lastExchange = transaction?.last_slug_assign_exchange_id
    ? exchanges[transaction.last_slug_assign_exchange_id]
    : null;
  const lastResponse = lastExchange?.response_id
    ? responses[lastExchange.response_id]
    : null;
  const parsedSlug =
    lastResponse?.parsed_response_json &&
    typeof lastResponse.parsed_response_json.slug === 'string'
      ? lastResponse.parsed_response_json.slug
      : null;

  if (!transaction) {
    return (
      <p className={styles.empty}>
        No transaction selected.{' '}
        <button type="button" className={styles.emptyLink} onClick={() => router.push(TRANSACTIONS_PATH)}>
          Back to list
        </button>
      </p>
    );
  }

  const handleDelete = async () => {
    const status = await dispatch(deleteTransactionThunk(transaction.id));
    if (status !== 200) return;
    router.push(TRANSACTIONS_PATH);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{transaction.description}</h1>
          <p className={styles.subtitle}>{transaction.posted_on}</p>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            onClick={() => setReslugOpen(true)}
            className={styles.secondaryButton}
          >
            Re-slug
          </button>
          <button
            type="button"
            onClick={() => setRecategorizeOpen(true)}
            className={styles.secondaryButton}
          >
            Re-categorize
          </button>
          <button type="button" onClick={() => void handleDelete()} className={styles.deleteButton}>
            Delete
          </button>
        </div>
      </div>
      <dl className={styles.details}>
        <div>
          <dt className={styles.term}>Amount</dt>
          <dd className={styles.value}>{formatCents(transaction.amount_cents)}</dd>
        </div>
        <div>
          <dt className={styles.term}>Source</dt>
          <dd className={`${styles.value} capitalize`}>{transaction.source}</dd>
        </div>
        <div>
          <dt className={styles.term}>
            {transaction.credit_card_id ? 'Credit card' : 'Bank account'}
          </dt>
          <dd className={styles.value}>
            {getTransactionAccountName(transaction, bankAccounts, creditCards)}
          </dd>
        </div>
        <div className={styles.categoryField}>
          <dt className={styles.term}>Category</dt>
          <dd className={styles.value}>
            <TransactionCategoryCombobox
              transactionId={transaction.id}
              categoryId={transaction.category_id}
              usePortal={false}
              className={styles.categoryCombobox}
              onError={(message) => setCategoryError(message)}
            />
            {categoryError && <p className={styles.categoryError}>{categoryError}</p>}
            <p className={styles.categoryNote}>
              Search, pick, or create a category. Re-categorize uses the bank memo only (not the
              slug).
            </p>
          </dd>
        </div>
        <div>
          <dt className={styles.term}>Slug</dt>
          <dd className={`${styles.value} font-mono`}>{transaction.slug ?? '—'}</dd>
        </div>
      </dl>
      {lastExchange && (
        <div className={styles.auditPanel}>
          <h2 className={styles.auditTitle}>Last slug assign</h2>
          <p className={styles.auditMeta}>
            Status: {lastExchange.status}
            {parsedSlug ? ` · Slug: ${parsedSlug}` : ''}
          </p>
          {typeof lastResponse?.parsed_response_json?.reason === 'string' && (
            <p className={styles.auditReason}>
              {lastResponse.parsed_response_json.reason}
            </p>
          )}
        </div>
      )}
      <ReslugFlowModal
        isOpen={reslugOpen}
        onClose={() => setReslugOpen(false)}
        transactionId={transaction.id}
        scopeLabel={`${transaction.description} · ${getTransactionAccountName(transaction, bankAccounts, creditCards)}`}
        onComplete={() => {
          void dispatch(loadTransactionSlugAssignAuditThunk(transaction.id));
        }}
      />
      <RecategorizeFlowModal
        isOpen={recategorizeOpen}
        onClose={() => setRecategorizeOpen(false)}
        transactionIds={transaction.id ? [transaction.id] : []}
        scopeLabel={transaction.description}
      />
    </div>
  );
};

const styles = {
  page: `
    space-y-4
  `,
  empty: `
    text-sm text-gray-600
  `,
  emptyLink: `
    underline
  `,
  header: `
    flex items-start justify-between gap-4
  `,
  headerActions: `
    flex shrink-0 items-center gap-2
  `,
  secondaryButton: `
    rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-50
  `,
  title: `
    text-2xl font-semibold text-gray-900
  `,
  subtitle: `
    text-sm text-gray-600
  `,
  deleteButton: `
    rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-700
  `,
  details: `
    grid gap-3 rounded-lg border border-gray-200 bg-white p-5
    sm:grid-cols-2
  `,
  term: `
    text-xs text-gray-500
  `,
  value: `
    text-sm font-medium
  `,
  categoryField: `
    sm:col-span-2
  `,
  categoryCombobox: `
    mt-0.5 max-w-md
  `,
  categoryError: `
    mt-1 text-xs text-red-600
  `,
  categoryNote: `
    mt-2 text-xs text-gray-500 max-w-lg
  `,
  auditPanel: `
    rounded-lg border border-gray-200 bg-white p-5 space-y-2
  `,
  auditTitle: `
    text-sm font-semibold text-gray-900
  `,
  auditMeta: `
    text-sm text-gray-600
  `,
  auditReason: `
    text-sm text-gray-500
  `,
} as const;
