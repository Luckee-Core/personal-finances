import { activateAiPrompt } from '@/api/ai-prompts';
import { AiPromptsActions } from '@/store/dumps';
import { loadAiPromptsThunk } from './load-ai-prompts-thunk';
import type { AppThunk } from '@/store/types';
import type { ThunkStatus } from '@/api/types';

/**
 * Activates an AI prompt and reloads the list for its type.
 */
export const activateAiPromptThunk =
  (id: string, type?: string): AppThunk<Promise<ThunkStatus>> =>
  async (dispatch) => {
    const result = await activateAiPrompt(id);
    if (!result.ok) {
      return result.status >= 500 ? 500 : 400;
    }
    dispatch(AiPromptsActions.upsertAiPrompt(result.data));
    if (type) {
      return dispatch(loadAiPromptsThunk(type));
    }
    return 200;
  };
