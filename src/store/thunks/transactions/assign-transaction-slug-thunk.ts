import { assignTransactionSlug } from '@/api/transactions';
import {
  TransactionsActions,
  TransactionSlugAssignAiExchangesActions,
  TransactionSlugAssignAiRequestsActions,
  TransactionSlugAssignAiResponsesActions,
} from '@/store/dumps';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Assigns a slug to one transaction and upserts transaction + audit dumps.
 */
export const assignTransactionSlugThunk =
  (transactionId: string, options?: { force?: boolean }): AppThunk<Promise<ThunkResult>> =>
  async (dispatch) => {
    const result = await assignTransactionSlug(transactionId, options);
    if (!result.ok) {
      return {
        status: result.status >= 500 ? 500 : 400,
        message: result.error.message,
      };
    }

    dispatch(TransactionsActions.upsertTransaction(result.data.transaction));

    if (result.data.audit) {
      dispatch(
        TransactionSlugAssignAiExchangesActions.upsertTransactionSlugAssignAiExchange(
          result.data.audit.exchange,
        ),
      );
      dispatch(
        TransactionSlugAssignAiRequestsActions.upsertTransactionSlugAssignAiRequest(
          result.data.audit.request,
        ),
      );
      if (result.data.audit.response) {
        dispatch(
          TransactionSlugAssignAiResponsesActions.upsertTransactionSlugAssignAiResponse(
            result.data.audit.response,
          ),
        );
      }
    }

    return { status: 200 };
  };
