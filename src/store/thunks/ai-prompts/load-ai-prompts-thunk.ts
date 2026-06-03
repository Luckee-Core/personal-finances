import { getAiPrompts } from '@/api/ai-prompts';
import { AiPromptsActions } from '@/store/dumps';
import type { AppThunk } from '@/store/types';
import type { ThunkStatus } from '@/api/types';
import type { AiPrompt } from '@/model/ai-prompt';

/**
 * Loads AI prompts into the dump, optionally filtered by type.
 */
export const loadAiPromptsThunk =
  (type?: string): AppThunk<Promise<ThunkStatus>> =>
  async (dispatch) => {
    const result = await getAiPrompts(type);
    if (!result.ok) {
      return result.status >= 500 ? 500 : 400;
    }
    const record = result.data.reduce<Record<string, AiPrompt>>((acc, row) => {
      acc[row.id] = row;
      return acc;
    }, {});
    dispatch(AiPromptsActions.setAiPrompts(record));
    return 200;
  };
