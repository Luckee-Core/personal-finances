import { deleteAnticipatedCost } from '@/api/anticipated-costs';
import { AnticipatedCostsActions } from '@/store/dumps';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Deletes an anticipated cost and removes it from the dump.
 */
export const deleteAnticipatedCostThunk =
  (id: string): AppThunk<Promise<ThunkResult>> =>
  async (dispatch) => {
    const result = await deleteAnticipatedCost(id);
    if (!result.ok) {
      return {
        status: result.status >= 500 ? 500 : 400,
        message: result.error.message,
      };
    }
    dispatch(AnticipatedCostsActions.removeAnticipatedCost(id));
    return { status: 200 };
  };
