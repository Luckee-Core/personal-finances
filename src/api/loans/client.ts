import { getApiClient } from '@/api/client';
import {
  fromCaughtError,
  fromExpressBody,
  fromExpressListBody,
  fromExpressVoidBody,
} from '@/api/_shared/express-response';
import type { ApiResponse } from '@/api/types';
import type { Loan } from '@/model/loan';

type ListBody = { success: boolean; data?: Loan[]; error?: string };
type EntityBody = { success: boolean; data?: Loan; error?: string };
type VoidBody = { success: boolean; error?: string };

export type CreateLoanPayload = {
  name: string;
  loan_vendor_id?: string | null;
  balance_cents: number;
  monthly_payment_cents: number;
  is_active?: boolean;
  notes?: string | null;
};

export type UpdateLoanPayload = Partial<CreateLoanPayload>;

/**
 * Loads all loans from Express `/api/data/loans`.
 */
export const getAllLoans = async (): Promise<ApiResponse<Loan[]>> => {
  try {
    const { data } = await getApiClient().get<ListBody>('/api/data/loans');
    return fromExpressListBody(data, 'Failed to load loans');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to load loans');
  }
};

/**
 * Creates a loan via POST `/api/data/loans`.
 */
export const createLoan = async (payload: CreateLoanPayload): Promise<ApiResponse<Loan>> => {
  try {
    const { data } = await getApiClient().post<EntityBody>('/api/data/loans', payload);
    return fromExpressBody(data, 'Failed to create loan');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to create loan');
  }
};

/**
 * Updates a loan via PATCH `/api/data/loans/:id`.
 */
export const updateLoan = async (
  id: string,
  payload: UpdateLoanPayload,
): Promise<ApiResponse<Loan>> => {
  try {
    const { data } = await getApiClient().patch<EntityBody>(`/api/data/loans/${id}`, payload);
    return fromExpressBody(data, 'Failed to update loan');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to update loan');
  }
};

/**
 * Deletes a loan via DELETE `/api/data/loans/:id`.
 */
export const deleteLoan = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const { data } = await getApiClient().delete<VoidBody>(`/api/data/loans/${id}`);
    return fromExpressVoidBody(data, 'Failed to delete loan');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to delete loan');
  }
};
