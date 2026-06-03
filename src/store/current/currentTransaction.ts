import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Transaction } from '@/model/transaction';

export const currentTransactionSlice = createSlice({
  name: 'currentTransaction',
  initialState: null as Transaction | null,
  reducers: {
    setCurrentTransaction: (_state, action: PayloadAction<Transaction | null>) => action.payload,
    clearCurrentTransaction: () => null,
  },
});

export const CurrentTransactionActions = currentTransactionSlice.actions;
export const currentTransactionReducer = currentTransactionSlice.reducer;
