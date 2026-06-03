import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { NotRecurring } from '@/model/not-recurring';

const initialState: Record<string, NotRecurring> = {};

export const notRecurringSlice = createSlice({
  name: 'notRecurring',
  initialState,
  reducers: {
    setNotRecurring: (_state, action: PayloadAction<Record<string, NotRecurring>>) =>
      action.payload,
    upsertNotRecurring: (state, action: PayloadAction<NotRecurring>) => {
      state[action.payload.id] = action.payload;
    },
    removeNotRecurring: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
  },
});

export const NotRecurringActions = notRecurringSlice.actions;
export const notRecurringReducer = notRecurringSlice.reducer;
