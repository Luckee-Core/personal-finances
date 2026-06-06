import { cache } from 'react';
import { getApiClient } from '@/api/client';
import type { ApiResponse } from '@/api/types';
import { fromCaughtError, fromExpressBody } from '@/api/_shared/express-response';
import type { ApiDocsCatalog } from './types';

/**
 * Loads the API documentation catalog from Express GET /api-docs.json.
 */
export const getApiDocsCatalog = async (): Promise<ApiResponse<ApiDocsCatalog>> => {
  try {
    const { data } = await getApiClient().get<{
      success: boolean;
      data?: ApiDocsCatalog;
      error?: string;
    }>('/api-docs.json');
    return fromExpressBody(data, 'Failed to load API documentation catalog');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to load API documentation catalog');
  }
};

/**
 * Request-deduped catalog fetch for docs layout + API page in the same render.
 */
export const getApiDocsCatalogCached = cache(getApiDocsCatalog);
