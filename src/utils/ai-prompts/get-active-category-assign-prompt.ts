import {
  AI_PROMPT_TYPE_TRANSACTION_CATEGORY_ASSIGN,
  type AiPrompt,
} from '@/model/ai-prompt';
import { DEFAULT_TRANSACTION_CATEGORY_ASSIGN_PROMPT } from '@/utils/ai-prompts';

/**
 * Returns the active category-assign prompt from the dump, if any.
 */
export const getActiveCategoryAssignPrompt = (
  promptsById: Record<string, AiPrompt>,
): AiPrompt | undefined =>
  Object.values(promptsById).find(
    (p) => p.type === AI_PROMPT_TYPE_TRANSACTION_CATEGORY_ASSIGN && p.isActive,
  );

/**
 * System prompt text for category assignment (active DB prompt or default).
 */
export const getCategoryAssignSystemPromptText = (
  promptsById: Record<string, AiPrompt>,
): string => {
  const active = getActiveCategoryAssignPrompt(promptsById);
  const fromDb = active?.content?.systemPrompt?.trim();
  return fromDb || DEFAULT_TRANSACTION_CATEGORY_ASSIGN_PROMPT;
};
