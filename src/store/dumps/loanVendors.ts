import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { LoanVendor } from '@/model/loan-vendor';

const initialState: Record<string, LoanVendor> = {};

export const loanVendorsSlice = createSlice({
  name: 'loanVendors',
  initialState,
  reducers: {
    setLoanVendors: (_state, action: PayloadAction<Record<string, LoanVendor>>) =>
      action.payload,
    upsertLoanVendor: (state, action: PayloadAction<LoanVendor>) => {
      state[action.payload.id] = action.payload;
    },
    removeLoanVendor: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
  },
});

export const LoanVendorsActions = loanVendorsSlice.actions;
export const loanVendorsReducer = loanVendorsSlice.reducer;
