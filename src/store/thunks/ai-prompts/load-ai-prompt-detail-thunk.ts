import { getAiPromptById } from '@/api/ai-prompts';
import { CurrentAiPromptActions } from '@/store/current';
import type { AppThunk } from '@/store/types';
import type { ThunkStatus } from '@/api/types';

/**
 * Refreshes the current AI prompt from the API by id.
 */
export const loadAiPromptDetailThunk =
  (id: string): AppThunk<Promise<ThunkStatus>> =>
  async (dispatch) => {
    const result = await getAiPromptById(id);
    if (!result.ok) {
      return result.status >= 500 ? 500 : 400;
    }
    dispatch(CurrentAiPromptActions.setCurrentAiPrompt(result.data));
    return 200;
  };
