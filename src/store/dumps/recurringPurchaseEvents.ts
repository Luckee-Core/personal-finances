import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RecurringPurchaseEvent } from '@/model/recurring-purchase-event';

const initialState: Record<string, RecurringPurchaseEvent> = {};

export const recurringPurchaseEventsSlice = createSlice({
  name: 'recurringPurchaseEvents',
  initialState,
  reducers: {
    setRecurringPurchaseEvents: (
      _state,
      action: PayloadAction<Record<string, RecurringPurchaseEvent>>,
    ) => action.payload,
    upsertRecurringPurchaseEvent: (state, action: PayloadAction<RecurringPurchaseEvent>) => {
      state[action.payload.id] = action.payload;
    },
    upsertRecurringPurchaseEvents: (state, action: PayloadAction<RecurringPurchaseEvent[]>) => {
      for (const event of action.payload) {
        state[event.id] = event;
      }
    },
    clearRecurringPurchaseEventsForPurchase: (state, action: PayloadAction<string>) => {
      const purchaseId = action.payload;
      for (const [id, event] of Object.entries(state)) {
        if (event.recurring_purchase_id === purchaseId) {
          delete state[id];
        }
      }
    },
  },
});

export const RecurringPurchaseEventsActions = recurringPurchaseEventsSlice.actions;
export const recurringPurchaseEventsReducer = recurringPurchaseEventsSlice.reducer;
