import { assignTransactionCategoriesBatchThunk } from './assign-transaction-categories-batch-thunk';
import { saveActiveCategoryAssignPromptThunk } from '@/store/thunks/ai-prompts';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

export type CategorizeTransactionsInput = {
  systemPrompt: string;
  savePrompt?: boolean;
  /** Assign categories to transactions with no category_id. */
  includeUncategorized?: boolean;
  /** Force re-assign transactions currently in these categories. */
  categoryIds?: string[];
  /** Force re-assign every transaction (same as Re-categorize all). */
  includeAll?: boolean;
  /** When set, only these transactions; ignores bucket flags. */
  transactionIds?: string[];
  /** With transactionIds: re-assign even when already categorized (default true). */
  force?: boolean;
};

const mergeMessages = (parts: string[]): string => parts.filter(Boolean).join(' ');

/**
 * Runs category assign with prompt override across one or more transaction buckets.
 */
export const categorizeTransactionsThunk =
  (input: CategorizeTransactionsInput): AppThunk<Promise<ThunkResult>> =>
  async (dispatch) => {
    const trimmedPrompt = input.systemPrompt.trim();
    if (!trimmedPrompt) {
      return { status: 400, message: 'System prompt is required' };
    }

    if (input.savePrompt) {
      const saveResult = await dispatch(saveActiveCategoryAssignPromptThunk(trimmedPrompt));
      if (saveResult.status !== 200) {
        return saveResult;
      }
    }

    const base = {
      system_prompt_override: trimmedPrompt,
    };

    if (input.transactionIds?.length) {
      const force = input.force !== false;
      return dispatch(
        assignTransactionCategoriesBatchThunk({
          ...base,
          transaction_ids: input.transactionIds,
          force,
          only_uncategorized: !force,
        }),
      );
    }

    const includeUncategorized = Boolean(input.includeUncategorized);
    const categoryIds = input.categoryIds?.filter(Boolean) ?? [];
    const includeAll = Boolean(input.includeAll);

    if (!includeUncategorized && categoryIds.length === 0 && !includeAll) {
      return { status: 400, message: 'Select at least one scope to categorize' };
    }

    const summaries: string[] = [];

    if (includeUncategorized) {
      const result = await dispatch(
        assignTransactionCategoriesBatchThunk({
          ...base,
          only_uncategorized: true,
        }),
      );
      if (result.status !== 200) {
        return result;
      }
      if (result.message) {
        summaries.push(result.message);
      }
    }

    if (categoryIds.length > 0) {
      const result = await dispatch(
        assignTransactionCategoriesBatchThunk({
          ...base,
          category_ids: categoryIds,
          force: true,
        }),
      );
      if (result.status !== 200) {
        return result;
      }
      if (result.message) {
        summaries.push(result.message);
      }
    }

    if (includeAll) {
      const result = await dispatch(
        assignTransactionCategoriesBatchThunk({
          ...base,
          force: true,
        }),
      );
      if (result.status !== 200) {
        return result;
      }
      if (result.message) {
        summaries.push(result.message);
      }
    }

    return {
      status: 200,
      message: mergeMessages(summaries) || 'Categorization finished',
    };
  };
