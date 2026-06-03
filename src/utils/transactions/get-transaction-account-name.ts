import type { BankAccount } from '@/model/bank-account';
import type { CreditCard } from '@/model/credit-card';
import type { Transaction } from '@/model/transaction';

export const getTransactionAccountName = (
  transaction: Pick<Transaction, 'bank_account_id' | 'credit_card_id'>,
  bankAccounts: Record<string, BankAccount>,
  creditCards: Record<string, CreditCard>,
): string => {
  if (transaction.bank_account_id) {
    return bankAccounts[transaction.bank_account_id]?.name ?? '—';
  }
  if (transaction.credit_card_id) {
    return creditCards[transaction.credit_card_id]?.name ?? '—';
  }
  return '—';
};
