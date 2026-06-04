import {
  createAnticipatedCost,
  type CreateAnticipatedCostPayload,
} from '@/api/anticipated-costs';
import { AnticipatedCostsActions } from '@/store/dumps';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Creates an anticipated cost and upserts it into the dump.
 */
export const createAnticipatedCostThunk =
  (payload: CreateAnticipatedCostPayload): AppThunk<Promise<ThunkResult>> =>
  async (dispatch) => {
    const result = await createAnticipatedCost(payload);
    if (!result.ok) {
      return {
        status: result.status >= 500 ? 500 : 400,
        message: result.error.message,
      };
    }
    dispatch(AnticipatedCostsActions.upsertAnticipatedCost(result.data));
    return { status: 200 };
  };
