import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RecurringDetectAiExchange } from '@/model/recurring-detect-ai-exchange';

const initialState: Record<string, RecurringDetectAiExchange> = {};

export const recurringDetectAiExchangesSlice = createSlice({
  name: 'recurringDetectAiExchanges',
  initialState,
  reducers: {
    setRecurringDetectAiExchanges: (
      _state,
      action: PayloadAction<Record<string, RecurringDetectAiExchange>>,
    ) => action.payload,
    upsertRecurringDetectAiExchange: (
      state,
      action: PayloadAction<RecurringDetectAiExchange>,
    ) => {
      state[action.payload.id] = action.payload;
    },
  },
});

export const RecurringDetectAiExchangesActions = recurringDetectAiExchangesSlice.actions;
export const recurringDetectAiExchangesReducer = recurringDetectAiExchangesSlice.reducer;
