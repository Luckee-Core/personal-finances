import { getApiClient } from '@/api/client';
import type { ApiResponse } from '@/api/types';
import { fromCaughtError, fromExpressListBody } from '@/api/_shared/express-response';
import type { LlmModel } from '@/model/llm-model';

/**
 * Loads all LLM pricing rows (bootstrap).
 */
export const getAllLlmModels = async (): Promise<ApiResponse<LlmModel[]>> => {
  try {
    const { data } = await getApiClient().get<{
      success: boolean;
      data?: LlmModel[];
      error?: string;
    }>('/api/data/llm-models');
    return fromExpressListBody(data, 'Failed to load LLM models');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to load LLM models');
  }
};
