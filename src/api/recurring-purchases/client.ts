import { getApiClient } from '@/api/client';
import {
  fromCaughtError,
  fromExpressBody,
  fromExpressListBody,
  fromExpressVoidBody,
} from '@/api/_shared/express-response';
import type { ApiResponse } from '@/api/types';
import type { NotRecurring } from '@/model/not-recurring';
import type { RecurringPurchaseEvent } from '@/model/recurring-purchase-event';
import type { RecurringPurchase, RecurringPurchaseStatus } from '@/model/recurring-purchase';

type ListBody = { success: boolean; data?: RecurringPurchase[]; error?: string };
type EntityBody = { success: boolean; data?: RecurringPurchase; error?: string };
type VoidBody = { success: boolean; error?: string };
type EventsBody = { success: boolean; data?: RecurringPurchaseEvent[]; error?: string };

type StatusChangeBody = {
  success: boolean;
  data?: { purchase: RecurringPurchase; event: RecurringPurchaseEvent };
  error?: string;
};

type NextDueChangeBody = {
  success: boolean;
  data?: { purchase: RecurringPurchase; event: RecurringPurchaseEvent };
  error?: string;
};

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

/**
 * Marks a recurring purchase's slug as not recurring.
 */
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

/**
 * Deletes a recurring purchase via DELETE `/api/data/recurring-purchases/:id`.
 */
export const deleteRecurringPurchase = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const { data } = await getApiClient().delete<VoidBody>(`/api/data/recurring-purchases/${id}`);
    return fromExpressVoidBody(data, 'Failed to delete recurring purchase');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to delete recurring purchase');
  }
};

export type ChangeRecurringPurchaseStatusPayload = {
  status: RecurringPurchaseStatus;
  pause_days?: number | null;
  notes?: string | null;
};

/**
 * Changes recurring purchase status and appends a history event.
 */
export const changeRecurringPurchaseStatus = async (
  id: string,
  payload: ChangeRecurringPurchaseStatusPayload,
): Promise<
  ApiResponse<{ purchase: RecurringPurchase; event: RecurringPurchaseEvent }>
> => {
  try {
    const { data } = await getApiClient().post<StatusChangeBody>(
      `/api/data/recurring-purchases/${id}/status`,
      payload,
    );
    return fromExpressBody(data, 'Failed to change recurring purchase status');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to change recurring purchase status');
  }
};

export type ChangeRecurringPurchaseNextDuePayload = {
  next_due_at: string | null;
  notes?: string | null;
};

/**
 * Changes next payment date and appends a history event.
 */
export const changeRecurringPurchaseNextDue = async (
  id: string,
  payload: ChangeRecurringPurchaseNextDuePayload,
): Promise<
  ApiResponse<{ purchase: RecurringPurchase; event: RecurringPurchaseEvent }>
> => {
  try {
    const { data } = await getApiClient().post<NextDueChangeBody>(
      `/api/data/recurring-purchases/${id}/next-due`,
      payload,
    );
    return fromExpressBody(data, 'Failed to change next payment date');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to change next payment date');
  }
};

/**
 * Loads recurring purchase history events for a purchase.
 */
export const getRecurringPurchaseEvents = async (
  id: string,
): Promise<ApiResponse<RecurringPurchaseEvent[]>> => {
  try {
    const { data } = await getApiClient().get<EventsBody>(
      `/api/data/recurring-purchases/${id}/events`,
    );
    return fromExpressListBody(data, 'Failed to load recurring purchase events');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to load recurring purchase events');
  }
};
