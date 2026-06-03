import { getAllCategories } from '@/api/categories';
import {
  assignTransactionCategoriesBatch,
  type AssignTransactionCategoryResult,
} from '@/api/transactions';
import { syncCurrentTransactionAfterUpsert } from './sync-current-transaction-after-upsert';
import {
  CategoriesActions,
  TransactionCategoryAssignAiExchangesActions,
  TransactionCategoryAssignAiRequestsActions,
  TransactionCategoryAssignAiResponsesActions,
} from '@/store/dumps';
import { rowsToEntityRecord } from '@/store/normalize';
import { loadTransactionsThunk } from './load-transactions-thunk';
import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

const mergeBatchResults = (
  dispatch: ThunkDispatch<RootState, unknown, UnknownAction>,
  getState: () => RootState,
  results: AssignTransactionCategoryResult[],
): void => {
  for (const row of results) {
    syncCurrentTransactionAfterUpsert(dispatch, getState, row.transaction);
    if (row.audit) {
      dispatch(
        TransactionCategoryAssignAiExchangesActions.upsertTransactionCategoryAssignAiExchange(
          row.audit.exchange,
        ),
      );
      dispatch(
        TransactionCategoryAssignAiRequestsActions.upsertTransactionCategoryAssignAiRequest(
          row.audit.request,
        ),
      );
      if (row.audit.response) {
        dispatch(
          TransactionCategoryAssignAiResponsesActions.upsertTransactionCategoryAssignAiResponse(
            row.audit.response,
          ),
        );
      }
    }
  }
};

/**
 * Batch-assigns categories in server chunks until none remain or a round fails.
 */
export const assignTransactionCategoriesBatchThunk =
  (input: {
    transaction_ids?: string[];
    only_uncategorized?: boolean;
    category_ids?: string[];
    force?: boolean;
    limit?: number;
    system_prompt_override?: string;
  }): AppThunk<Promise<ThunkResult>> =>
  async (dispatch, getState) => {
    const chunkLimit = input.limit ?? 25;
    let remaining = 1;
    let totalMatching = 0;
    let totalSucceeded = 0;
    let totalFailed = 0;
    let categoriesCreated = 0;

    while (remaining > 0) {
      const result = await assignTransactionCategoriesBatch({ ...input, limit: chunkLimit });
      if (!result.ok) {
        return {
          status: result.status >= 500 ? 500 : 400,
          message: result.error.message,
        };
      }

      mergeBatchResults(dispatch, getState, result.data.results);

      totalMatching = result.data.total_matching;
      remaining = result.data.remaining;
      totalSucceeded += result.data.succeeded;
      totalFailed += result.data.failed;
      categoriesCreated += result.data.categories_created;

      if (result.data.processed === 0) {
        break;
      }

      // No progress this round (all skipped) — avoid burning through remaining.
      if (result.data.succeeded === 0 && result.data.remaining > 0) {
        break;
      }
    }

    await dispatch(loadTransactionsThunk());
    const cats = await getAllCategories();
    if (cats.ok) {
      dispatch(CategoriesActions.setCategories(rowsToEntityRecord(cats.data)));
    }

    if (totalMatching === 0) {
      const emptyMessage = input.only_uncategorized || input.force === false
        ? 'No uncategorized transactions'
        : input.category_ids?.length
          ? 'No transactions in the selected categories'
          : 'No transactions to categorize';
      return {
        status: 200,
        message: emptyMessage,
      };
    }

    if (totalSucceeded === 0 && totalFailed === 0) {
      return {
        status: 200,
        message: 'No uncategorized transactions',
      };
    }

    if (totalSucceeded === 0) {
      return {
        status: 400,
        message: `${totalFailed} transaction(s) failed to assign category`,
      };
    }

    const successVerb = input.force ? 'Categorized' : 'Assigned categories to';
    const createdSuffix =
      categoriesCreated > 0
        ? ` (${categoriesCreated} new categor${categoriesCreated === 1 ? 'y' : 'ies'} created)`
        : '';
    const failedSuffix =
      totalFailed > 0 ? ` · ${totalFailed} failed (retry Categorize uncategorized)` : '';

    return {
      status: 200,
      message: `${successVerb} ${totalSucceeded} transaction(s)${createdSuffix}${failedSuffix}`,
    };
  };
