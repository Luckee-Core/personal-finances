import { createCategory } from '@/api/categories';
import { CategoriesActions } from '@/store/dumps';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Creates a category and upserts it into the store.
 */
export const createCategoryThunk =
  (name: string): AppThunk<Promise<ThunkResult>> =>
  async (dispatch) => {
    const trimmed = name.trim();
    if (!trimmed) {
      return { status: 400, message: 'Category name is required' };
    }

    const result = await createCategory({ name: trimmed });
    if (!result.ok) {
      return {
        status: result.status >= 500 ? 500 : 400,
        message: result.error.message,
      };
    }

    dispatch(CategoriesActions.upsertCategory(result.data));
    return { status: 200, entityId: result.data.id };
  };
