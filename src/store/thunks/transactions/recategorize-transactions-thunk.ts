import { categorizeTransactionsThunk } from './categorize-transactions-thunk';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

export type RecategorizeTransactionsInput = {
  transactionIds: string[];
  systemPrompt: string;
  /** Persist prompt to the active DB version before re-categorizing. */
  savePrompt?: boolean;
};

/**
 * Force re-assigns categories for the given transactions using the modal prompt text.
 */
export const recategorizeTransactionsThunk =
  (input: RecategorizeTransactionsInput): AppThunk<Promise<ThunkResult>> =>
  async (dispatch) => {
    if (input.transactionIds.length === 0) {
      return { status: 400, message: 'No transactions selected' };
    }

    return dispatch(
      categorizeTransactionsThunk({
        transactionIds: input.transactionIds,
        systemPrompt: input.systemPrompt,
        savePrompt: input.savePrompt,
      }),
    );
  };
