import { getTransactionSlugAssignAudit } from '@/api/transactions';
import {
  TransactionSlugAssignAiExchangesActions,
  TransactionSlugAssignAiRequestsActions,
  TransactionSlugAssignAiResponsesActions,
} from '@/store/dumps';
import { rowsToEntityRecord } from '@/store/normalize';
import type { AppThunk } from '@/store/types';
import type { ThunkStatus } from '@/api/types';
import type { TransactionSlugAssignAiExchange } from '@/model/transaction-slug-assign-ai-exchange';
import type { TransactionSlugAssignAiRequest } from '@/model/transaction-slug-assign-ai-request';
import type { TransactionSlugAssignAiResponse } from '@/model/transaction-slug-assign-ai-response';

/**
 * Loads slug-assign audit rows for a transaction into audit dumps.
 */
export const loadTransactionSlugAssignAuditThunk =
  (transactionId: string): AppThunk<Promise<ThunkStatus>> =>
  async (dispatch, getState) => {
    const result = await getTransactionSlugAssignAudit(transactionId);
    if (!result.ok) {
      return result.status >= 500 ? 500 : 400;
    }

    const { exchanges, requests, responses } = result.data;

    const mergeExchanges = {
      ...getState().transactionSlugAssignAiExchanges,
      ...rowsToEntityRecord(exchanges as TransactionSlugAssignAiExchange[]),
    };
    const mergeRequests = {
      ...getState().transactionSlugAssignAiRequests,
      ...rowsToEntityRecord(requests as TransactionSlugAssignAiRequest[]),
    };
    const mergeResponses = {
      ...getState().transactionSlugAssignAiResponses,
      ...rowsToEntityRecord(responses as TransactionSlugAssignAiResponse[]),
    };

    dispatch(TransactionSlugAssignAiExchangesActions.setTransactionSlugAssignAiExchanges(mergeExchanges));
    dispatch(TransactionSlugAssignAiRequestsActions.setTransactionSlugAssignAiRequests(mergeRequests));
    dispatch(TransactionSlugAssignAiResponsesActions.setTransactionSlugAssignAiResponses(mergeResponses));

    return 200;
  };
