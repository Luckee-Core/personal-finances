import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RecurringPurchase } from '@/model/recurring-purchase';

export const currentRecurringPurchaseSlice = createSlice({
  name: 'currentRecurringPurchase',
  initialState: null as RecurringPurchase | null,
  reducers: {
    setCurrentRecurringPurchase: (_state, action: PayloadAction<RecurringPurchase | null>) =>
      action.payload,
    clearCurrentRecurringPurchase: () => null,
  },
});

export const CurrentRecurringPurchaseActions = currentRecurringPurchaseSlice.actions;
export const currentRecurringPurchaseReducer = currentRecurringPurchaseSlice.reducer;
