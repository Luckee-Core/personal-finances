import { updateAiPrompt } from '@/api/ai-prompts';
import { AI_PROMPT_TYPE_TRANSACTION_CATEGORY_ASSIGN } from '@/model/ai-prompt';
import { AiPromptsActions } from '@/store/dumps';
import { getActiveCategoryAssignPrompt } from '@/utils/ai-prompts';
import { loadAiPromptsThunk } from './load-ai-prompts-thunk';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Updates the active transaction_category_assign prompt system text.
 */
export const saveActiveCategoryAssignPromptThunk =
  (systemPrompt: string): AppThunk<Promise<ThunkResult>> =>
  async (dispatch, getState) => {
    let active = getActiveCategoryAssignPrompt(getState().aiPrompts);
    if (!active) {
      const loadResult = await dispatch(
        loadAiPromptsThunk(AI_PROMPT_TYPE_TRANSACTION_CATEGORY_ASSIGN),
      );
      if (loadResult.status !== 200) {
        return { status: 400, message: 'Could not load category assign prompt' };
      }
      active = getActiveCategoryAssignPrompt(getState().aiPrompts);
    }
    if (!active) {
      return { status: 400, message: 'No active category assign prompt found' };
    }

    const result = await updateAiPrompt(active.id, {
      content: { systemPrompt: systemPrompt.trim() },
    });
    if (!result.ok) {
      return {
        status: result.status >= 500 ? 500 : 400,
        message: result.error.message,
      };
    }
    dispatch(AiPromptsActions.upsertAiPrompt(result.data));
    return { status: 200 };
  };
