import { getApiClient } from '@/api/client';
import type { ApiResponse } from '@/api/types';
import { fromCaughtError, fromExpressListBody } from '@/api/_shared/express-response';
import type { RecurringDetectAiExchange } from '@/model/recurring-detect-ai-exchange';
import type { TransactionCategoryAssignAiExchange } from '@/model/transaction-category-assign-ai-exchange';
import type { TransactionSlugAssignAiExchange } from '@/model/transaction-slug-assign-ai-exchange';

/**
 * Loads all completed slug-assign exchanges (bootstrap).
 */
export const getAllTransactionSlugAssignAiExchanges = async (): Promise<
  ApiResponse<TransactionSlugAssignAiExchange[]>
> => {
  try {
    const { data } = await getApiClient().get<{
      success: boolean;
      data?: TransactionSlugAssignAiExchange[];
      error?: string;
    }>('/api/data/transaction-slug-assign-ai-exchanges');
    return fromExpressListBody(data, 'Failed to load slug assign exchanges');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to load slug assign exchanges');
  }
};

/**
 * Loads all completed category-assign exchanges (bootstrap).
 */
export const getAllTransactionCategoryAssignAiExchanges = async (): Promise<
  ApiResponse<TransactionCategoryAssignAiExchange[]>
> => {
  try {
    const { data } = await getApiClient().get<{
      success: boolean;
      data?: TransactionCategoryAssignAiExchange[];
      error?: string;
    }>('/api/data/transaction-category-assign-ai-exchanges');
    return fromExpressListBody(data, 'Failed to load category assign exchanges');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to load category assign exchanges');
  }
};

/**
 * Loads all completed recurring-detect exchanges (bootstrap).
 */
export const getAllRecurringDetectAiExchanges = async (): Promise<
  ApiResponse<RecurringDetectAiExchange[]>
> => {
  try {
    const { data } = await getApiClient().get<{
      success: boolean;
      data?: RecurringDetectAiExchange[];
      error?: string;
    }>('/api/data/recurring-detect-ai-exchanges');
    return fromExpressListBody(data, 'Failed to load recurring detect exchanges');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to load recurring detect exchanges');
  }
};
