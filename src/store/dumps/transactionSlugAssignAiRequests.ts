import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TransactionSlugAssignAiRequest } from '@/model/transaction-slug-assign-ai-request';

const initialState: Record<string, TransactionSlugAssignAiRequest> = {};

export const transactionSlugAssignAiRequestsSlice = createSlice({
  name: 'transactionSlugAssignAiRequests',
  initialState,
  reducers: {
    setTransactionSlugAssignAiRequests: (
      _state,
      action: PayloadAction<Record<string, TransactionSlugAssignAiRequest>>,
    ) => action.payload,
    upsertTransactionSlugAssignAiRequest: (
      state,
      action: PayloadAction<TransactionSlugAssignAiRequest>,
    ) => {
      state[action.payload.id] = action.payload;
    },
  },
});

export const TransactionSlugAssignAiRequestsActions =
  transactionSlugAssignAiRequestsSlice.actions;
export const transactionSlugAssignAiRequestsReducer =
  transactionSlugAssignAiRequestsSlice.reducer;
