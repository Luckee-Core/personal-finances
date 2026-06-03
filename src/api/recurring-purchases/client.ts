import { getApiClient } from '@/api/client';
import {
  fromCaughtError,
  fromExpressBody,
  fromExpressListBody,
  fromExpressVoidBody,
} from '@/api/_shared/express-response';
import type { ApiResponse } from '@/api/types';
import type { NotRecurring } from '@/model/not-recurring';
import type { RecurringPurchase } from '@/model/recurring-purchase';

type ListBody = { success: boolean; data?: RecurringPurchase[]; error?: string };
type EntityBody = { success: boolean; data?: RecurringPurchase; error?: string };
type VoidBody = { success: boolean; error?: string };

export type CreateRecurringPurchasePayload = {
  name: string;
  amount_cents: number;
  billing_interval?: RecurringPurchase['billing_interval'];
  vendor?: string | null;
  next_due_at?: string | null;
  is_active?: boolean;
  notes?: string | null;
};

/**
 * Loads all recurring purchases.
 */
export const getAllRecurringPurchases = async (): Promise<ApiResponse<RecurringPurchase[]>> => {
  try {
    const { data } = await getApiClient().get<ListBody>('/api/data/recurring-purchases');
    return fromExpressListBody(data, 'Failed to load recurring purchases');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to load recurring purchases');
  }
};

/**
 * Creates a recurring purchase.
 */
export const createRecurringPurchase = async (
  payload: CreateRecurringPurchasePayload,
): Promise<ApiResponse<RecurringPurchase>> => {
  try {
    const { data } = await getApiClient().post<EntityBody>('/api/data/recurring-purchases', payload);
    return fromExpressBody(data, 'Failed to create recurring purchase');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to create recurring purchase');
  }
};

/**
 * Updates a recurring purchase by id.
 */
export const updateRecurringPurchase = async (
  id: string,
  payload: Partial<CreateRecurringPurchasePayload>,
): Promise<ApiResponse<RecurringPurchase>> => {
  try {
    const { data } = await getApiClient().patch<EntityBody>(
      `/api/data/recurring-purchases/${id}`,
      payload,
    );
    return fromExpressBody(data, 'Failed to update recurring purchase');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to update recurring purchase');
  }
};

/**
 * Deletes a recurring purchase by id.
 */
export type MarkNotRecurringResult = {
  not_recurring: NotRecurring;
  slug: string;
};

export const markRecurringPurchaseNotRecurring = async (
  id: string,
): Promise<ApiResponse<MarkNotRecurringResult>> => {
  try {
    const { data } = await getApiClient().post<{ success: boolean; data?: MarkNotRecurringResult; error?: string }>(
      `/api/data/recurring-purchases/${id}/mark-not-recurring`,
    );
    return fromExpressBody(data, 'Failed to mark as not recurring');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to mark as not recurring');
  }
};

export const deleteRecurringPurchase = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const { data } = await getApiClient().delete<VoidBody>(`/api/data/recurring-purchases/${id}`);
    return fromExpressVoidBody(data, 'Failed to delete recurring purchase');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to delete recurring purchase');
  }
};
