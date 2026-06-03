import { assignTransactionSlug } from '@/api/transactions';
import {
  TransactionsActions,
  TransactionSlugAssignAiExchangesActions,
  TransactionSlugAssignAiRequestsActions,
  TransactionSlugAssignAiResponsesActions,
} from '@/store/dumps';
import { saveActiveSlugAssignPromptThunk } from '@/store/thunks/ai-prompts/save-active-slug-assign-prompt-thunk';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

export type ReslugTransactionInput = {
  transactionId: string;
  systemPrompt: string;
  savePrompt?: boolean;
  usePromptOverride?: boolean;
};

export const reslugTransactionThunk =
  (input: ReslugTransactionInput): AppThunk<Promise<ThunkResult>> =>
  async (dispatch) => {
    if (input.savePrompt) {
      const saveResult = await dispatch(saveActiveSlugAssignPromptThunk(input.systemPrompt));
      if (saveResult.status !== 200) {
        return saveResult;
      }
    }

    const result = await assignTransactionSlug(input.transactionId, {
      force: true,
      system_prompt_override:
        input.savePrompt || !input.usePromptOverride
          ? undefined
          : input.systemPrompt.trim(),
    });

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

    return { status: 200, message: `Slug set to ${result.data.slug}` };
  };
