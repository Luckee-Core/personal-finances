import { AI_PROMPT_TYPE_TRANSACTION_SLUG_ASSIGN, type AiPrompt } from '@/model/ai-prompt';
import { DEFAULT_TRANSACTION_SLUG_ASSIGN_PROMPT } from '@/utils/ai-prompts/constants';

export const getActiveSlugAssignPrompt = (
  promptsById: Record<string, AiPrompt>,
): AiPrompt | undefined =>
  Object.values(promptsById).find(
    (p) => p.type === AI_PROMPT_TYPE_TRANSACTION_SLUG_ASSIGN && p.isActive,
  );

export const getSlugAssignSystemPromptText = (promptsById: Record<string, AiPrompt>): string => {
  const active = getActiveSlugAssignPrompt(promptsById);
  const fromDb = active?.content?.systemPrompt?.trim();
  return fromDb || DEFAULT_TRANSACTION_SLUG_ASSIGN_PROMPT;
};
