import { getApiClient } from '@/api/client';
import {
  fromCaughtError,
  fromExpressBody,
  fromExpressListBody,
  fromExpressVoidBody,
} from '@/api/_shared/express-response';
import type { ApiResponse } from '@/api/types';
import type {
  AnticipatedCost,
  AnticipatedCostStatus,
  AnticipatedTimeframeInterval,
} from '@/model/anticipated-cost';

type ListBody = { success: boolean; data?: AnticipatedCost[]; error?: string };
type EntityBody = { success: boolean; data?: AnticipatedCost; error?: string };
type VoidBody = { success: boolean; error?: string };

export type CreateAnticipatedCostPayload = {
  name: string;
  amount_cents: number;
  due_on: string;
  category_id?: string | null;
  notes?: string | null;
  timeframe_interval?: AnticipatedTimeframeInterval | null;
  timeframe_every?: number | null;
  timeframe_count?: number | null;
  status?: AnticipatedCostStatus;
};

export type UpdateAnticipatedCostPayload = Partial<CreateAnticipatedCostPayload>;

/**
 * Loads all anticipated costs from Express `/api/data/anticipated-costs`.
 */
export const getAllAnticipatedCosts = async (): Promise<ApiResponse<AnticipatedCost[]>> => {
  try {
    const { data } = await getApiClient().get<ListBody>('/api/data/anticipated-costs');
    return fromExpressListBody(data, 'Failed to load anticipated costs');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to load anticipated costs');
  }
};

/**
 * Creates an anticipated cost via POST `/api/data/anticipated-costs`.
 */
export const createAnticipatedCost = async (
  payload: CreateAnticipatedCostPayload,
): Promise<ApiResponse<AnticipatedCost>> => {
  try {
    const { data } = await getApiClient().post<EntityBody>(
      '/api/data/anticipated-costs',
      payload,
    );
    return fromExpressBody(data, 'Failed to create anticipated cost');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to create anticipated cost');
  }
};

/**
 * Updates an anticipated cost via PATCH `/api/data/anticipated-costs/:id`.
 */
export const updateAnticipatedCost = async (
  id: string,
  payload: UpdateAnticipatedCostPayload,
): Promise<ApiResponse<AnticipatedCost>> => {
  try {
    const { data } = await getApiClient().patch<EntityBody>(
      `/api/data/anticipated-costs/${id}`,
      payload,
    );
    return fromExpressBody(data, 'Failed to update anticipated cost');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to update anticipated cost');
  }
};

/**
 * Deletes an anticipated cost via DELETE `/api/data/anticipated-costs/:id`.
 */
export const deleteAnticipatedCost = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const { data } = await getApiClient().delete<VoidBody>(
      `/api/data/anticipated-costs/${id}`,
    );
    return fromExpressVoidBody(data, 'Failed to delete anticipated cost');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to delete anticipated cost');
  }
};
