import { getAllCategories } from '@/api/categories';
import { assignTransactionCategory } from '@/api/transactions';
import { syncCurrentTransactionAfterUpsert } from './sync-current-transaction-after-upsert';
import {
  CategoriesActions,
  TransactionCategoryAssignAiExchangesActions,
  TransactionCategoryAssignAiRequestsActions,
  TransactionCategoryAssignAiResponsesActions,
} from '@/store/dumps';
import { rowsToEntityRecord } from '@/store/normalize';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Assigns a category to one transaction and upserts transaction + audit dumps.
 */
export const assignTransactionCategoryThunk =
  (transactionId: string, options?: { force?: boolean }): AppThunk<Promise<ThunkResult>> =>
  async (dispatch, getState) => {
    const result = await assignTransactionCategory(transactionId, options);
    if (!result.ok) {
      return {
        status: result.status >= 500 ? 500 : 400,
        message: result.error.message,
      };
    }

    syncCurrentTransactionAfterUpsert(dispatch, getState, result.data.transaction);

    if (result.data.audit) {
      dispatch(
        TransactionCategoryAssignAiExchangesActions.upsertTransactionCategoryAssignAiExchange(
          result.data.audit.exchange,
        ),
      );
      dispatch(
        TransactionCategoryAssignAiRequestsActions.upsertTransactionCategoryAssignAiRequest(
          result.data.audit.request,
        ),
      );
      if (result.data.audit.response) {
        dispatch(
          TransactionCategoryAssignAiResponsesActions.upsertTransactionCategoryAssignAiResponse(
            result.data.audit.response,
          ),
        );
      }
    }

    if (result.data.category_created) {
      const cats = await getAllCategories();
      if (cats.ok) {
        dispatch(CategoriesActions.setCategories(rowsToEntityRecord(cats.data)));
      }
    }

    return { status: 200 };
  };
