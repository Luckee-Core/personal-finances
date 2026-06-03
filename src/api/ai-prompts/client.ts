import { getApiClient } from '@/api/client';
import {
  fromCaughtError,
  fromExpressBody,
  fromExpressListBody,
  fromExpressVoidBody,
} from '@/api/_shared/express-response';
import type { ApiResponse } from '@/api/types';
import { mapAiPromptDto, type AiPrompt, type AiPromptDto } from '@/model/ai-prompt';

type ListBody = { success: boolean; data?: AiPromptDto[]; error?: string };
type EntityBody = { success: boolean; data?: AiPromptDto; error?: string };
type VoidBody = { success: boolean; error?: string };

export type CreateAiPromptPayload = {
  type: string;
  name: string;
  content?: Record<string, unknown>;
  makeActive?: boolean;
};

export type UpdateAiPromptPayload = {
  name?: string;
  content?: Record<string, unknown>;
};

/**
 * Lists AI prompts, optionally filtered by type.
 */
export const getAiPrompts = async (type?: string): Promise<ApiResponse<AiPrompt[]>> => {
  try {
    const { data } = await getApiClient().get<ListBody>('/api/data/ai-prompts', {
      params: type ? { type } : undefined,
    });
    const result = fromExpressListBody(data, 'Failed to load AI prompts');
    if (!result.ok) return result;
    return { ...result, data: result.data.map(mapAiPromptDto) };
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to load AI prompts');
  }
};

/**
 * Fetches one AI prompt by id.
 */
export const getAiPromptById = async (id: string): Promise<ApiResponse<AiPrompt>> => {
  try {
    const { data } = await getApiClient().get<EntityBody>(`/api/data/ai-prompts/${id}`);
    const result = fromExpressBody(data, 'Failed to load AI prompt');
    if (!result.ok) return result;
    return { ...result, data: mapAiPromptDto(result.data) };
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to load AI prompt');
  }
};

/**
 * Creates a new AI prompt version.
 */
export const createAiPrompt = async (
  payload: CreateAiPromptPayload,
): Promise<ApiResponse<AiPrompt>> => {
  try {
    const { data } = await getApiClient().post<EntityBody>('/api/data/ai-prompts', payload);
    const result = fromExpressBody(data, 'Failed to create AI prompt');
    if (!result.ok) return result;
    return { ...result, data: mapAiPromptDto(result.data) };
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to create AI prompt');
  }
};

/**
 * Updates an AI prompt.
 */
export const updateAiPrompt = async (
  id: string,
  payload: UpdateAiPromptPayload,
): Promise<ApiResponse<AiPrompt>> => {
  try {
    const { data } = await getApiClient().patch<EntityBody>(`/api/data/ai-prompts/${id}`, payload);
    const result = fromExpressBody(data, 'Failed to update AI prompt');
    if (!result.ok) return result;
    return { ...result, data: mapAiPromptDto(result.data) };
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to update AI prompt');
  }
};

/**
 * Activates an AI prompt version for its type.
 */
export const activateAiPrompt = async (id: string): Promise<ApiResponse<AiPrompt>> => {
  try {
    const { data } = await getApiClient().post<EntityBody>(`/api/data/ai-prompts/${id}/activate`);
    const result = fromExpressBody(data, 'Failed to activate AI prompt');
    if (!result.ok) return result;
    return { ...result, data: mapAiPromptDto(result.data) };
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to activate AI prompt');
  }
};

/**
 * Deletes an AI prompt version.
 */
export const deleteAiPrompt = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const { data } = await getApiClient().delete<VoidBody>(`/api/data/ai-prompts/${id}`);
    return fromExpressVoidBody(data, 'Failed to delete AI prompt');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to delete AI prompt');
  }
};
