import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RecurringPurchase } from '@/model/recurring-purchase';

const initialState: Record<string, RecurringPurchase> = {};

export const recurringPurchasesSlice = createSlice({
  name: 'recurringPurchases',
  initialState,
  reducers: {
    setRecurringPurchases: (
      _state,
      action: PayloadAction<Record<string, RecurringPurchase>>,
    ) => action.payload,
    upsertRecurringPurchase: (state, action: PayloadAction<RecurringPurchase>) => {
      state[action.payload.id] = action.payload;
    },
    removeRecurringPurchase: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
  },
});

export const RecurringPurchasesActions = recurringPurchasesSlice.actions;
export const recurringPurchasesReducer = recurringPurchasesSlice.reducer;
