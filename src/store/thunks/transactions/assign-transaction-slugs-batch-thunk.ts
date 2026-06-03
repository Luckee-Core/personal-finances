import {
  assignTransactionSlugsBatch,
  type AssignTransactionSlugResult,
} from '@/api/transactions';
import {
  TransactionsActions,
  TransactionSlugAssignAiExchangesActions,
  TransactionSlugAssignAiRequestsActions,
  TransactionSlugAssignAiResponsesActions,
} from '@/store/dumps';
import { loadTransactionsThunk } from './load-transactions-thunk';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

const mergeBatchResults = (
  dispatch: Parameters<AppThunk<Promise<ThunkResult>>>[0],
  results: AssignTransactionSlugResult[],
): void => {
  for (const row of results) {
    dispatch(TransactionsActions.upsertTransaction(row.transaction));
    if (row.audit) {
      dispatch(
        TransactionSlugAssignAiExchangesActions.upsertTransactionSlugAssignAiExchange(
          row.audit.exchange,
        ),
      );
      dispatch(
        TransactionSlugAssignAiRequestsActions.upsertTransactionSlugAssignAiRequest(
          row.audit.request,
        ),
      );
      if (row.audit.response) {
        dispatch(
          TransactionSlugAssignAiResponsesActions.upsertTransactionSlugAssignAiResponse(
            row.audit.response,
          ),
        );
      }
    }
  }
};

/**
 * Batch-assigns slugs in server chunks (25 per request) until none remain or a round fails.
 */
export const assignTransactionSlugsBatchThunk =
  (input: {
    transaction_ids?: string[];
    only_unslagged?: boolean;
    force?: boolean;
    limit?: number;
  }): AppThunk<Promise<ThunkResult>> =>
  async (dispatch) => {
    const chunkLimit = input.limit ?? 25;
    let remaining = 1;
    let totalMatching = 0;
    let totalProcessed = 0;
    let totalFailed = 0;

    while (remaining > 0) {
      const result = await assignTransactionSlugsBatch({ ...input, limit: chunkLimit });
      if (!result.ok) {
        return {
          status: result.status >= 500 ? 500 : 400,
          message: result.error.message,
        };
      }

      mergeBatchResults(dispatch, result.data.results);

      totalMatching = result.data.total_matching;
      remaining = result.data.remaining;
      totalProcessed += result.data.processed;
      totalFailed += result.data.failed;

      if (result.data.failed > 0) {
        await dispatch(loadTransactionsThunk());
        return {
          status: 400,
          message: `${result.data.failed} transaction(s) failed to assign slug`,
          batchProcessed: totalProcessed,
          batchRemaining: remaining,
          batchTotalMatching: totalMatching,
        };
      }

      if (result.data.processed === 0) {
        break;
      }
    }

    await dispatch(loadTransactionsThunk());

    if (totalMatching === 0) {
      return {
        status: 200,
        message: 'All transactions already have slugs',
        batchProcessed: 0,
        batchRemaining: 0,
        batchTotalMatching: 0,
      };
    }

    return {
      status: 200,
      message:
        totalFailed > 0
          ? `${totalFailed} transaction(s) failed to assign slug`
          : `Assigned slugs to ${totalProcessed} transaction(s)`,
      batchProcessed: totalProcessed,
      batchRemaining: 0,
      batchTotalMatching: totalMatching,
    };
  };
