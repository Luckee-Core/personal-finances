import { createAiPrompt, type CreateAiPromptPayload } from '@/api/ai-prompts';
import { AiPromptsActions } from '@/store/dumps';
import type { AppThunk } from '@/store/types';
import type { ThunkStatus } from '@/api/types';

/**
 * Creates a new AI prompt version.
 */
export const createAiPromptThunk =
  (payload: CreateAiPromptPayload): AppThunk<Promise<ThunkStatus>> =>
  async (dispatch) => {
    const result = await createAiPrompt(payload);
    if (!result.ok) {
      return result.status >= 500 ? 500 : 400;
    }
    dispatch(AiPromptsActions.upsertAiPrompt(result.data));
    return 200;
  };
