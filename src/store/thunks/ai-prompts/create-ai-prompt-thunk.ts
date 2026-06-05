import { createAiPrompt, type CreateAiPromptPayload } from '@/api/ai-prompts';
import { AiPromptsActions } from '@/store/dumps';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Creates a new AI prompt version.
 */
export const createAiPromptThunk =
  (payload: CreateAiPromptPayload): AppThunk<Promise<ThunkResult>> =>
  async (dispatch) => {
    const result = await createAiPrompt(payload);
    if (!result.ok) {
      return {
        status: result.status >= 500 ? 500 : 400,
        message: result.error.message,
      };
    }
    dispatch(AiPromptsActions.upsertAiPrompt(result.data));
    return { status: 200 };
  };
