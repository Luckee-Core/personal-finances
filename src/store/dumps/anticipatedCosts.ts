import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AnticipatedCost } from '@/model/anticipated-cost';

const initialState: Record<string, AnticipatedCost> = {};

export const anticipatedCostsSlice = createSlice({
  name: 'anticipatedCosts',
  initialState,
  reducers: {
    setAnticipatedCosts: (_state, action: PayloadAction<Record<string, AnticipatedCost>>) =>
      action.payload,
    upsertAnticipatedCost: (state, action: PayloadAction<AnticipatedCost>) => {
      state[action.payload.id] = action.payload;
    },
    removeAnticipatedCost: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
  },
});

export const AnticipatedCostsActions = anticipatedCostsSlice.actions;
export const anticipatedCostsReducer = anticipatedCostsSlice.reducer;
