import type { AiPrompt } from '@/model/ai-prompt';
import { CurrentAiPromptActions } from '@/store/current';
import type { AppThunk } from '@/store/types';

/**
 * Sets the selected AI prompt for detail navigation.
 */
export const setCurrentAiPromptThunk =
  (prompt: AiPrompt | null): AppThunk =>
  (dispatch) => {
    dispatch(CurrentAiPromptActions.setCurrentAiPrompt(prompt));
  };
