import { updateAiPrompt } from '@/api/ai-prompts';
import { AI_PROMPT_TYPE_TRANSACTION_SLUG_ASSIGN } from '@/model/ai-prompt';
import { AiPromptsActions } from '@/store/dumps';
import { getActiveSlugAssignPrompt } from '@/utils/ai-prompts';
import { loadAiPromptsThunk } from './load-ai-prompts-thunk';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Updates the active transaction_slug_assign prompt system text.
 */
export const saveActiveSlugAssignPromptThunk =
  (systemPrompt: string): AppThunk<Promise<ThunkResult>> =>
  async (dispatch, getState) => {
    let active = getActiveSlugAssignPrompt(getState().aiPrompts);
    if (!active) {
      const loadResult = await dispatch(loadAiPromptsThunk(AI_PROMPT_TYPE_TRANSACTION_SLUG_ASSIGN));
      if (loadResult.status !== 200) {
        return { status: 400, message: 'Could not load slug assign prompt' };
      }
      active = getActiveSlugAssignPrompt(getState().aiPrompts);
    }
    if (!active) {
      return { status: 400, message: 'No active slug assign prompt found' };
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
