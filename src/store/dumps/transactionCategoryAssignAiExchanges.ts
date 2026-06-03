import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TransactionCategoryAssignAiExchange } from '@/model/transaction-category-assign-ai-exchange';

const initialState: Record<string, TransactionCategoryAssignAiExchange> = {};

export const transactionCategoryAssignAiExchangesSlice = createSlice({
  name: 'transactionCategoryAssignAiExchanges',
  initialState,
  reducers: {
    setTransactionCategoryAssignAiExchanges: (
      _state,
      action: PayloadAction<Record<string, TransactionCategoryAssignAiExchange>>,
    ) => action.payload,
    upsertTransactionCategoryAssignAiExchange: (
      state,
      action: PayloadAction<TransactionCategoryAssignAiExchange>,
    ) => {
      state[action.payload.id] = action.payload;
    },
  },
});

export const TransactionCategoryAssignAiExchangesActions =
  transactionCategoryAssignAiExchangesSlice.actions;
export const transactionCategoryAssignAiExchangesReducer =
  transactionCategoryAssignAiExchangesSlice.reducer;
