import type { Transaction } from '@/model/transaction';

export const transactionSpendCents = (transaction: Transaction): number => {
  const { amount_cents, source } = transaction;
  if (amount_cents === 0) return 0;
  if (source === 'manual') {
    return amount_cents > 0 ? amount_cents : 0;
  }
  if (amount_cents < 0) {
    return Math.abs(amount_cents);
  }
  return amount_cents;
};
