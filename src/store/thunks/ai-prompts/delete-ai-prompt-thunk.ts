import { deleteAiPrompt } from '@/api/ai-prompts';
import { AiPromptsActions } from '@/store/dumps';
import { loadAiPromptsThunk } from './load-ai-prompts-thunk';
import type { AppThunk } from '@/store/types';
import type { ThunkStatus } from '@/api/types';

/**
 * Deletes an AI prompt version and reloads the list.
 */
export const deleteAiPromptThunk =
  (id: string, type?: string): AppThunk<Promise<ThunkStatus>> =>
  async (dispatch) => {
    const result = await deleteAiPrompt(id);
    if (!result.ok) {
      return result.status >= 500 ? 500 : 400;
    }
    dispatch(AiPromptsActions.removeAiPrompt(id));
    if (type) {
      return dispatch(loadAiPromptsThunk(type));
    }
    return 200;
  };
