import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Loan } from '@/model/loan';

const initialState: Record<string, Loan> = {};

export const loansSlice = createSlice({
  name: 'loans',
  initialState,
  reducers: {
    setLoans: (_state, action: PayloadAction<Record<string, Loan>>) => action.payload,
    upsertLoan: (state, action: PayloadAction<Loan>) => {
      state[action.payload.id] = action.payload;
    },
    removeLoan: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
  },
});

export const LoansActions = loansSlice.actions;
export const loansReducer = loansSlice.reducer;
