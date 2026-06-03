import { getApiClient } from '@/api/client';
import {
  fromCaughtError,
  fromExpressBody,
  fromExpressListBody,
  fromExpressVoidBody,
} from '@/api/_shared/express-response';
import type { ApiResponse } from '@/api/types';
import type { Transaction } from '@/model/transaction';
import type { TransactionCategoryAssignAiExchange } from '@/model/transaction-category-assign-ai-exchange';
import type { TransactionCategoryAssignAiRequest } from '@/model/transaction-category-assign-ai-request';
import type { TransactionCategoryAssignAiResponse } from '@/model/transaction-category-assign-ai-response';
import type { TransactionSlugAssignAiExchange } from '@/model/transaction-slug-assign-ai-exchange';
import type { TransactionSlugAssignAiRequest } from '@/model/transaction-slug-assign-ai-request';
import type { TransactionSlugAssignAiResponse } from '@/model/transaction-slug-assign-ai-response';

type ListBody = { success: boolean; data?: Transaction[]; error?: string };
type EntityBody = { success: boolean; data?: Transaction; error?: string };
type VoidBody = { success: boolean; error?: string };

export type CreateTransactionPayload = {
  bank_account_id?: string | null;
  credit_card_id?: string | null;
  category_id?: string | null;
  posted_on: string;
  amount_cents: number;
  description?: string;
};

export type TransactionQuery = {
  bankAccountId?: string;
  categoryId?: string;
  source?: 'manual' | 'import';
  fromDate?: string;
  toDate?: string;
};

/**
 * Loads transactions with optional filters.
 */
export const getAllTransactions = async (
  query?: TransactionQuery,
): Promise<ApiResponse<Transaction[]>> => {
  try {
    const { data } = await getApiClient().get<ListBody>('/api/data/transactions', { params: query });
    return fromExpressListBody(data, 'Failed to load transactions');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to load transactions');
  }
};

/**
 * Creates a transaction.
 */
export const createTransaction = async (
  payload: CreateTransactionPayload,
): Promise<ApiResponse<Transaction>> => {
  try {
    const { data } = await getApiClient().post<EntityBody>('/api/data/transactions', payload);
    return fromExpressBody(data, 'Failed to create transaction');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to create transaction');
  }
};

/**
 * Updates a transaction by id.
 */
export const updateTransaction = async (
  id: string,
  payload: Partial<CreateTransactionPayload>,
): Promise<ApiResponse<Transaction>> => {
  try {
    const { data } = await getApiClient().patch<EntityBody>(`/api/data/transactions/${id}`, payload);
    return fromExpressBody(data, 'Failed to update transaction');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to update transaction');
  }
};

/**
 * Deletes a transaction by id.
 */
export const deleteTransaction = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const { data } = await getApiClient().delete<VoidBody>(`/api/data/transactions/${id}`);
    return fromExpressVoidBody(data, 'Failed to delete transaction');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to delete transaction');
  }
};

export type AssignSlugAuditBundle = {
  exchange: TransactionSlugAssignAiExchange;
  request: TransactionSlugAssignAiRequest;
  response: TransactionSlugAssignAiResponse | null;
};

export type AssignTransactionSlugResult = {
  transaction: Transaction;
  slug: string;
  matched_existing: boolean;
  confidence: string;
  reason: string;
  audit: AssignSlugAuditBundle | null;
  skipped: boolean;
};

type AssignSlugBody = { success: boolean; data?: AssignTransactionSlugResult; error?: string };

/**
 * Assigns a merchant slug to one transaction via AI.
 */
export const assignTransactionSlug = async (
  transactionId: string,
  options?: { force?: boolean; system_prompt_override?: string },
): Promise<ApiResponse<AssignTransactionSlugResult>> => {
  try {
    const path = options?.force
      ? `/api/ai/transactions/${transactionId}/assign-slug?force=true`
      : `/api/ai/transactions/${transactionId}/assign-slug`;
    const body =
      options?.system_prompt_override?.trim()
        ? { system_prompt_override: options.system_prompt_override.trim() }
        : {};
    const { data } = await getApiClient().post<AssignSlugBody>(path, body);
    return fromExpressBody(data, 'Failed to assign slug');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to assign slug');
  }
};

export type AssignTransactionSlugsBatchResult = {
  processed: number;
  succeeded: number;
  failed: number;
  skipped: number;
  total_matching: number;
  remaining: number;
  results: AssignTransactionSlugResult[];
  errors: { transaction_id: string; error: string }[];
};

type BatchAssignBody = {
  success: boolean;
  data?: AssignTransactionSlugsBatchResult;
  error?: string;
};

/**
 * Assigns slugs to multiple transactions via AI.
 */
export const assignTransactionSlugsBatch = async (input: {
  transaction_ids?: string[];
  only_unslagged?: boolean;
  force?: boolean;
  limit?: number;
}): Promise<ApiResponse<AssignTransactionSlugsBatchResult>> => {
  try {
    const { data } = await getApiClient().post<BatchAssignBody>(
      '/api/ai/transactions/assign-slugs',
      input,
    );
    return fromExpressBody(data, 'Failed to assign slugs in batch');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to assign slugs in batch');
  }
};

export type TransactionSlugAssignAudit = {
  exchanges: TransactionSlugAssignAiExchange[];
  requests: TransactionSlugAssignAiRequest[];
  responses: TransactionSlugAssignAiResponse[];
};

/**
 * Loads slug-assign audit rows for a transaction.
 */
export const getTransactionSlugAssignAudit = async (
  transactionId: string,
): Promise<ApiResponse<TransactionSlugAssignAudit>> => {
  try {
    const client = getApiClient();
    const [exchangesRes, requestsRes] = await Promise.all([
      client.get<{ success: boolean; data?: TransactionSlugAssignAiExchange[]; error?: string }>(
        '/api/data/transaction-slug-assign-ai-exchanges',
        { params: { transaction_id: transactionId } },
      ),
      client.get<{ success: boolean; data?: TransactionSlugAssignAiRequest[]; error?: string }>(
        '/api/data/transaction-slug-assign-ai-requests',
        { params: { transaction_id: transactionId } },
      ),
    ]);

    const exchanges = fromExpressListBody(
      exchangesRes.data,
      'Failed to load slug assign exchanges',
    );
    if (!exchanges.ok) return exchanges;

    const requests = fromExpressListBody(requestsRes.data, 'Failed to load slug assign requests');
    if (!requests.ok) return requests;

    const responses: TransactionSlugAssignAiResponse[] = [];
    for (const req of requests.data) {
      const { data } = await client.get<{
        success: boolean;
        data?: TransactionSlugAssignAiResponse[];
        error?: string;
      }>('/api/data/transaction-slug-assign-ai-responses', {
        params: { request_id: req.id },
      });
      const list = fromExpressListBody(data, 'Failed to load slug assign responses');
      if (list.ok) responses.push(...list.data);
    }

    return {
      ok: true,
      status: 200,
      data: {
        exchanges: exchanges.data,
        requests: requests.data,
        responses,
      },
    };
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to load slug assign audit');
  }
};

export type AssignCategoryAuditBundle = {
  exchange: TransactionCategoryAssignAiExchange;
  request: TransactionCategoryAssignAiRequest;
  response: TransactionCategoryAssignAiResponse | null;
};

export type AssignTransactionCategoryResult = {
  transaction: Transaction;
  category_id: string;
  category_name: string;
  category_created: boolean;
  matched_existing: boolean;
  confidence: string;
  reason: string;
  audit: AssignCategoryAuditBundle | null;
  skipped: boolean;
};

type AssignCategoryBody = {
  success: boolean;
  data?: AssignTransactionCategoryResult;
  error?: string;
};

/**
 * Assigns a category to one transaction via AI (reuse or create category).
 */
export const assignTransactionCategory = async (
  transactionId: string,
  options?: { force?: boolean; system_prompt_override?: string },
): Promise<ApiResponse<AssignTransactionCategoryResult>> => {
  try {
    const path = options?.force
      ? `/api/ai/transactions/${transactionId}/assign-category?force=true`
      : `/api/ai/transactions/${transactionId}/assign-category`;
    const body =
      options?.system_prompt_override?.trim()
        ? { system_prompt_override: options.system_prompt_override.trim() }
        : {};
    const { data } = await getApiClient().post<AssignCategoryBody>(path, body);
    return fromExpressBody(data, 'Failed to assign category');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to assign category');
  }
};

export type AssignTransactionCategoriesBatchResult = {
  processed: number;
  succeeded: number;
  failed: number;
  skipped: number;
  categories_created: number;
  total_matching: number;
  remaining: number;
  results: AssignTransactionCategoryResult[];
  errors: { transaction_id: string; error: string }[];
};

type BatchAssignCategoriesBody = {
  success: boolean;
  data?: AssignTransactionCategoriesBatchResult;
  error?: string;
};

/**
 * Assigns categories to multiple transactions via AI.
 */
export const assignTransactionCategoriesBatch = async (input: {
  transaction_ids?: string[];
  only_uncategorized?: boolean;
  category_ids?: string[];
  force?: boolean;
  limit?: number;
  system_prompt_override?: string;
}): Promise<ApiResponse<AssignTransactionCategoriesBatchResult>> => {
  try {
    const { data } = await getApiClient().post<BatchAssignCategoriesBody>(
      '/api/ai/transactions/assign-categories',
      input,
    );
    return fromExpressBody(data, 'Failed to assign categories in batch');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to assign categories in batch');
  }
};
