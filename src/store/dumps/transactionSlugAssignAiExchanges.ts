import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TransactionSlugAssignAiExchange } from '@/model/transaction-slug-assign-ai-exchange';

const initialState: Record<string, TransactionSlugAssignAiExchange> = {};

export const transactionSlugAssignAiExchangesSlice = createSlice({
  name: 'transactionSlugAssignAiExchanges',
  initialState,
  reducers: {
    setTransactionSlugAssignAiExchanges: (
      _state,
      action: PayloadAction<Record<string, TransactionSlugAssignAiExchange>>,
    ) => action.payload,
    upsertTransactionSlugAssignAiExchange: (
      state,
      action: PayloadAction<TransactionSlugAssignAiExchange>,
    ) => {
      state[action.payload.id] = action.payload;
    },
  },
});

export const TransactionSlugAssignAiExchangesActions =
  transactionSlugAssignAiExchangesSlice.actions;
export const transactionSlugAssignAiExchangesReducer =
  transactionSlugAssignAiExchangesSlice.reducer;
