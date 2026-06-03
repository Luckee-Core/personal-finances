import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TransactionCategoryAssignAiResponse } from '@/model/transaction-category-assign-ai-response';

const initialState: Record<string, TransactionCategoryAssignAiResponse> = {};

export const transactionCategoryAssignAiResponsesSlice = createSlice({
  name: 'transactionCategoryAssignAiResponses',
  initialState,
  reducers: {
    setTransactionCategoryAssignAiResponses: (
      _state,
      action: PayloadAction<Record<string, TransactionCategoryAssignAiResponse>>,
    ) => action.payload,
    upsertTransactionCategoryAssignAiResponse: (
      state,
      action: PayloadAction<TransactionCategoryAssignAiResponse>,
    ) => {
      state[action.payload.id] = action.payload;
    },
  },
});

export const TransactionCategoryAssignAiResponsesActions =
  transactionCategoryAssignAiResponsesSlice.actions;
export const transactionCategoryAssignAiResponsesReducer =
  transactionCategoryAssignAiResponsesSlice.reducer;
