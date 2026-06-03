import { updateAiPrompt, type UpdateAiPromptPayload } from '@/api/ai-prompts';
import { AiPromptsActions } from '@/store/dumps';
import { CurrentAiPromptActions } from '@/store/current';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Saves the current AI prompt draft to the API.
 */
export const saveAiPromptThunk =
  (payload: UpdateAiPromptPayload): AppThunk<Promise<ThunkResult>> =>
  async (dispatch, getState) => {
    const current = getState().currentAiPrompt;
    if (!current) {
      return { status: 400, message: 'No prompt selected' };
    }
    const result = await updateAiPrompt(current.id, payload);
    if (!result.ok) {
      return {
        status: result.status >= 500 ? 500 : 400,
        message: result.error.message,
      };
    }
    dispatch(AiPromptsActions.upsertAiPrompt(result.data));
    dispatch(CurrentAiPromptActions.setCurrentAiPrompt(result.data));
    return { status: 200 };
  };
