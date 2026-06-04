import { getApiClient } from '@/api/client';
import {
  fromCaughtError,
  fromExpressBody,
  fromExpressListBody,
} from '@/api/_shared/express-response';
import type { ApiResponse } from '@/api/types';
import type { CreditCard } from '@/model/credit-card';

type ListBody = { success: boolean; data?: CreditCard[]; error?: string };
type EntityBody = { success: boolean; data?: CreditCard; error?: string };

export type CreateCreditCardPayload = {
  name: string;
  issuer?: string | null;
  last_four?: string | null;
};

/**
 * Loads all credit cards from Express `/api/data/credit-cards`.
 */
export const getAllCreditCards = async (): Promise<ApiResponse<CreditCard[]>> => {
  try {
    const { data } = await getApiClient().get<ListBody>('/api/data/credit-cards');
    return fromExpressListBody(data, 'Failed to load credit cards');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to load credit cards');
  }
};

/**
 * Creates a credit card via POST `/api/data/credit-cards`.
 */
export const createCreditCard = async (
  payload: CreateCreditCardPayload,
): Promise<ApiResponse<CreditCard>> => {
  try {
    const { data } = await getApiClient().post<EntityBody>('/api/data/credit-cards', payload);
    return fromExpressBody(data, 'Failed to create credit card');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to create credit card');
  }
};
