import {
  updateAnticipatedCost,
  type UpdateAnticipatedCostPayload,
} from '@/api/anticipated-costs';
import { AnticipatedCostsActions } from '@/store/dumps';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Updates an anticipated cost and upserts it into the dump.
 */
export const updateAnticipatedCostThunk =
  (id: string, payload: UpdateAnticipatedCostPayload): AppThunk<Promise<ThunkResult>> =>
  async (dispatch) => {
    const result = await updateAnticipatedCost(id, payload);
    if (!result.ok) {
      return {
        status: result.status >= 500 ? 500 : 400,
        message: result.error.message,
      };
    }
    dispatch(AnticipatedCostsActions.upsertAnticipatedCost(result.data));
    return { status: 200 };
  };
