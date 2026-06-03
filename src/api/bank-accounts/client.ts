import { getApiClient } from '@/api/client';
import {
  fromCaughtError,
  fromExpressBody,
  fromExpressListBody,
} from '@/api/_shared/express-response';
import type { ApiResponse } from '@/api/types';
import type { BankAccount } from '@/model/bank-account';

type ListBody = { success: boolean; data?: BankAccount[]; error?: string };
type EntityBody = { success: boolean; data?: BankAccount; error?: string };

export type CreateBankAccountPayload = {
  name: string;
  account_type?: string;
};

/**
 * Loads all bank accounts from the API.
 */
export const getAllBankAccounts = async (): Promise<ApiResponse<BankAccount[]>> => {
  try {
    const { data } = await getApiClient().get<ListBody>('/api/data/bank-accounts');
    return fromExpressListBody(data, 'Failed to load bank accounts');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to load bank accounts');
  }
};

/**
 * Creates a bank account.
 */
export const createBankAccount = async (
  payload: CreateBankAccountPayload,
): Promise<ApiResponse<BankAccount>> => {
  try {
    const { data } = await getApiClient().post<EntityBody>('/api/data/bank-accounts', payload);
    return fromExpressBody(data, 'Failed to create bank account');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to create bank account');
  }
};
