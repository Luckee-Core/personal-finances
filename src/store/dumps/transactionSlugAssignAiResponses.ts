import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TransactionSlugAssignAiResponse } from '@/model/transaction-slug-assign-ai-response';

const initialState: Record<string, TransactionSlugAssignAiResponse> = {};

export const transactionSlugAssignAiResponsesSlice = createSlice({
  name: 'transactionSlugAssignAiResponses',
  initialState,
  reducers: {
    setTransactionSlugAssignAiResponses: (
      _state,
      action: PayloadAction<Record<string, TransactionSlugAssignAiResponse>>,
    ) => action.payload,
    upsertTransactionSlugAssignAiResponse: (
      state,
      action: PayloadAction<TransactionSlugAssignAiResponse>,
    ) => {
      state[action.payload.id] = action.payload;
    },
  },
});

export const TransactionSlugAssignAiResponsesActions =
  transactionSlugAssignAiResponsesSlice.actions;
export const transactionSlugAssignAiResponsesReducer =
  transactionSlugAssignAiResponsesSlice.reducer;
