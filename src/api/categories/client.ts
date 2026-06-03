import { getApiClient } from '@/api/client';
import {
  fromCaughtError,
  fromExpressBody,
  fromExpressListBody,
} from '@/api/_shared/express-response';
import type { ApiResponse } from '@/api/types';
import type { Category } from '@/model/category';

type ListBody = { success: boolean; data?: Category[]; error?: string };
type EntityBody = { success: boolean; data?: Category; error?: string };

export type CreateCategoryPayload = {
  name: string;
  color?: string | null;
};

/**
 * Loads all categories from the API.
 */
export const getAllCategories = async (): Promise<ApiResponse<Category[]>> => {
  try {
    const { data } = await getApiClient().get<ListBody>('/api/data/categories');
    return fromExpressListBody(data, 'Failed to load categories');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to load categories');
  }
};

/**
 * Creates a category.
 */
export const createCategory = async (
  payload: CreateCategoryPayload,
): Promise<ApiResponse<Category>> => {
  try {
    const { data } = await getApiClient().post<EntityBody>('/api/data/categories', payload);
    return fromExpressBody(data, 'Failed to create category');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to create category');
  }
};
