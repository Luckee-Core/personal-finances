import { getApiClient } from '@/api/client';
import {
  fromCaughtError,
  fromExpressBody,
  fromExpressListBody,
  fromExpressVoidBody,
} from '@/api/_shared/express-response';
import type { ApiResponse } from '@/api/types';
import type { LoanVendor } from '@/model/loan-vendor';

type ListBody = { success: boolean; data?: LoanVendor[]; error?: string };
type EntityBody = { success: boolean; data?: LoanVendor; error?: string };
type VoidBody = { success: boolean; error?: string };

export type CreateLoanVendorPayload = {
  name: string;
};

export type UpdateLoanVendorPayload = Partial<CreateLoanVendorPayload>;

/**
 * Loads all loan vendors from Express `/api/data/loan-vendors`.
 */
export const getAllLoanVendors = async (): Promise<ApiResponse<LoanVendor[]>> => {
  try {
    const { data } = await getApiClient().get<ListBody>('/api/data/loan-vendors');
    return fromExpressListBody(data, 'Failed to load loan vendors');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to load loan vendors');
  }
};

/**
 * Creates a loan vendor via POST `/api/data/loan-vendors`.
 */
export const createLoanVendor = async (
  payload: CreateLoanVendorPayload,
): Promise<ApiResponse<LoanVendor>> => {
  try {
    const { data } = await getApiClient().post<EntityBody>('/api/data/loan-vendors', payload);
    return fromExpressBody(data, 'Failed to create loan vendor');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to create loan vendor');
  }
};

/**
 * Updates a loan vendor via PATCH `/api/data/loan-vendors/:id`.
 */
export const updateLoanVendor = async (
  id: string,
  payload: UpdateLoanVendorPayload,
): Promise<ApiResponse<LoanVendor>> => {
  try {
    const { data } = await getApiClient().patch<EntityBody>(
      `/api/data/loan-vendors/${id}`,
      payload,
    );
    return fromExpressBody(data, 'Failed to update loan vendor');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to update loan vendor');
  }
};

/**
 * Deletes a loan vendor via DELETE `/api/data/loan-vendors/:id`.
 */
export const deleteLoanVendor = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const { data } = await getApiClient().delete<VoidBody>(`/api/data/loan-vendors/${id}`);
    return fromExpressVoidBody(data, 'Failed to delete loan vendor');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to delete loan vendor');
  }
};
