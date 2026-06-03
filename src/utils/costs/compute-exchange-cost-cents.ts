import { DEFAULT_LLM_MODEL, type LlmModel } from '@/model/llm-model';

/**
 * Computes exchange cost in cents from token usage and llm_models pricing.
 */
export const computeExchangeCostCents = (
  inputTokens: number,
  outputTokens: number,
  modelUsed: string | null | undefined,
  llmModels: Record<string, LlmModel>,
): number => {
  const modelKey = modelUsed?.trim() || DEFAULT_LLM_MODEL;
  const pricing = llmModels[modelKey];
  if (!pricing) return 0;
  const usd =
    (inputTokens / 1_000_000) * Number(pricing.input_cost_per_million_usd) +
    (outputTokens / 1_000_000) * Number(pricing.output_cost_per_million_usd);
  return usd * 100;
};
