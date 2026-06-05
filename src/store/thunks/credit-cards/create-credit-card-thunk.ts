import { createCreditCard, type CreateCreditCardPayload } from '@/api/credit-cards';
import { CreditCardsActions } from '@/store/dumps';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Creates a credit card via the API and upserts it into the dump.
 */
export const createCreditCardThunk =
  (payload: CreateCreditCardPayload): AppThunk<Promise<ThunkResult>> =>
  async (dispatch) => {
    const result = await createCreditCard(payload);
    if (!result.ok) {
      return {
        status: result.status >= 500 ? 500 : 400,
        message: result.error.message,
      };
    }
    dispatch(CreditCardsActions.upsertCreditCard(result.data));
    return { status: 200 };
  };
