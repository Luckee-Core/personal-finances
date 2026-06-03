import { getApiClient } from '@/api/client';
import { fromCaughtError, fromExpressListBody } from '@/api/_shared/express-response';
import type { ApiResponse } from '@/api/types';
import type { NotRecurring } from '@/model/not-recurring';

type ListBody = { success: boolean; data?: NotRecurring[]; error?: string };

export const getAllNotRecurring = async (): Promise<ApiResponse<NotRecurring[]>> => {
  try {
    const { data } = await getApiClient().get<ListBody>('/api/data/not-recurring');
    return fromExpressListBody(data, 'Failed to load not recurring slugs');
  } catch (error: unknown) {
    return fromCaughtError(error, 'Failed to load not recurring slugs');
  }
};
