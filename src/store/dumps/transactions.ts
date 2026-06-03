import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Transaction } from '@/model/transaction';

const initialState: Record<string, Transaction> = {};

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTransactions: (_state, action: PayloadAction<Record<string, Transaction>>) => action.payload,
    upsertTransaction: (state, action: PayloadAction<Transaction>) => {
      state[action.payload.id] = action.payload;
    },
    removeTransaction: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
  },
});

export const TransactionsActions = transactionsSlice.actions;
export const transactionsReducer = transactionsSlice.reducer;
