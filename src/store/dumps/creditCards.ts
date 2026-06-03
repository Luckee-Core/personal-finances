import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CreditCard } from '@/model/credit-card';

const initialState: Record<string, CreditCard> = {};

export const creditCardsSlice = createSlice({
  name: 'creditCards',
  initialState,
  reducers: {
    setCreditCards: (_state, action: PayloadAction<Record<string, CreditCard>>) => action.payload,
    upsertCreditCard: (state, action: PayloadAction<CreditCard>) => {
      state[action.payload.id] = action.payload;
    },
  },
});

export const CreditCardsActions = creditCardsSlice.actions;
export const creditCardsReducer = creditCardsSlice.reducer;
