import { detectRecurringPurchases } from '@/api/recurring-detect';
import { RecurringDetectAiExchangesActions, RecurringPurchasesActions } from '@/store/dumps';
import { loadTransactionsThunk } from '@/store/thunks/transactions/load-transactions-thunk';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Runs full-ledger recurring detection in a single AI exchange.
 */
export const detectRecurringPurchasesThunk =
  (input: {
    slugs?: string[];
    min_transactions?: number;
    only_unlinked?: boolean;
    create_recurring?: boolean;
  }): AppThunk<Promise<ThunkResult>> =>
  async (dispatch) => {
    const result = await detectRecurringPurchases(input);
    if (!result.ok) {
      return {
        status: result.status >= 500 ? 500 : 400,
        message: result.error.message,
      };
    }

    const { data } = result;

    for (const row of data.results) {
      if (row.recurring_purchase) {
        dispatch(RecurringPurchasesActions.upsertRecurringPurchase(row.recurring_purchase));
      }
    }

    if (data.audit?.exchange) {
      dispatch(
        RecurringDetectAiExchangesActions.upsertRecurringDetectAiExchange(data.audit.exchange),
      );
    }

    await dispatch(loadTransactionsThunk());

    if (data.transaction_count === 0) {
      return {
        status: 200,
        message:
          'No transactions with slugs to analyze. Assign slugs on the Transactions page first.',
      };
    }

    if (data.recurring_found === 0) {
      return {
        status: 200,
        message: `Analyzed ${data.transaction_count} transactions; no recurring patterns found.`,
      };
    }

    const createdPart =
      input.create_recurring && data.recurring_purchases_created > 0
        ? ` · ${data.recurring_purchases_created} new recurring purchase(s) created`
        : input.create_recurring
          ? ' · linked to existing recurring purchases where applicable'
          : '';

    return {
      status: 200,
      message: `Analyzed ${data.transaction_count} transactions in one pass; found ${data.recurring_found} recurring charge(s)${createdPart}.`,
    };
  };
