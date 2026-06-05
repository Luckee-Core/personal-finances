import { activateAiPrompt } from '@/api/ai-prompts';
import { AiPromptsActions } from '@/store/dumps';
import { loadAiPromptsThunk } from './load-ai-prompts-thunk';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Activates an AI prompt and reloads the list for its type.
 */
export const activateAiPromptThunk =
  (id: string, type?: string): AppThunk<Promise<ThunkResult>> =>
  async (dispatch) => {
    const result = await activateAiPrompt(id);
    if (!result.ok) {
      return {
        status: result.status >= 500 ? 500 : 400,
        message: result.error.message,
      };
    }
    dispatch(AiPromptsActions.upsertAiPrompt(result.data));
    if (type) {
      return dispatch(loadAiPromptsThunk(type));
    }
    return { status: 200 };
  };
