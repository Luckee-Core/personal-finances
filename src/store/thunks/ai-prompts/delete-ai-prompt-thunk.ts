import { deleteAiPrompt } from '@/api/ai-prompts';
import { AiPromptsActions } from '@/store/dumps';
import { loadAiPromptsThunk } from './load-ai-prompts-thunk';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Deletes an AI prompt version and reloads the list.
 */
export const deleteAiPromptThunk =
  (id: string, type?: string): AppThunk<Promise<ThunkResult>> =>
  async (dispatch) => {
    const result = await deleteAiPrompt(id);
    if (!result.ok) {
      return {
        status: result.status >= 500 ? 500 : 400,
        message: result.error.message,
      };
    }
    dispatch(AiPromptsActions.removeAiPrompt(id));
    if (type) {
      return dispatch(loadAiPromptsThunk(type));
    }
    return { status: 200 };
  };
