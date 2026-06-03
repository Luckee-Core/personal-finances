export const AI_PROMPT_TYPE_TRANSACTION_SLUG_ASSIGN = 'transaction_slug_assign';
export const AI_PROMPT_TYPE_TRANSACTION_CATEGORY_ASSIGN = 'transaction_category_assign';
export const AI_PROMPT_TYPE_RECURRING_DETECT = 'recurring_detect';

export type AiPromptContent = {
  systemPrompt?: string;
};

export type AiPrompt = {
  id: string;
  type: string;
  name: string;
  version: number;
  isActive: boolean;
  content: AiPromptContent;
  createdAt: string;
  updatedAt: string;
};

export type AiPromptDto = {
  id: string;
  type: string;
  name: string;
  version: number;
  isActive: boolean;
  content: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

/**
 * Maps express AI prompt DTO to the frontend model.
 */
export const mapAiPromptDto = (dto: AiPromptDto): AiPrompt => ({
  id: dto.id,
  type: dto.type,
  name: dto.name,
  version: dto.version,
  isActive: dto.isActive,
  content: (dto.content ?? {}) as AiPromptContent,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});
