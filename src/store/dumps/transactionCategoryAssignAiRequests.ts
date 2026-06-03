import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TransactionCategoryAssignAiRequest } from '@/model/transaction-category-assign-ai-request';

const initialState: Record<string, TransactionCategoryAssignAiRequest> = {};

export const transactionCategoryAssignAiRequestsSlice = createSlice({
  name: 'transactionCategoryAssignAiRequests',
  initialState,
  reducers: {
    setTransactionCategoryAssignAiRequests: (
      _state,
      action: PayloadAction<Record<string, TransactionCategoryAssignAiRequest>>,
    ) => action.payload,
    upsertTransactionCategoryAssignAiRequest: (
      state,
      action: PayloadAction<TransactionCategoryAssignAiRequest>,
    ) => {
      state[action.payload.id] = action.payload;
    },
  },
});

export const TransactionCategoryAssignAiRequestsActions =
  transactionCategoryAssignAiRequestsSlice.actions;
export const transactionCategoryAssignAiRequestsReducer =
  transactionCategoryAssignAiRequestsSlice.reducer;
