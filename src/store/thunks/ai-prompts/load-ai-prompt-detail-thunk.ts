import { getAiPromptById } from '@/api/ai-prompts';
import { CurrentAiPromptActions } from '@/store/current';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Refreshes the current AI prompt from the API by id.
 */
export const loadAiPromptDetailThunk =
  (id: string): AppThunk<Promise<ThunkResult>> =>
  async (dispatch) => {
    const result = await getAiPromptById(id);
    if (!result.ok) {
      return {
        status: result.status >= 500 ? 500 : 400,
        message: result.error.message,
      };
    }
    dispatch(CurrentAiPromptActions.setCurrentAiPrompt(result.data));
    return { status: 200 };
  };
