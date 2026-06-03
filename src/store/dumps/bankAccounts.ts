import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { BankAccount } from '@/model/bank-account';

const initialState: Record<string, BankAccount> = {};

export const bankAccountsSlice = createSlice({
  name: 'bankAccounts',
  initialState,
  reducers: {
    setBankAccounts: (_state, action: PayloadAction<Record<string, BankAccount>>) => action.payload,
    upsertBankAccount: (state, action: PayloadAction<BankAccount>) => {
      state[action.payload.id] = action.payload;
    },
  },
});

export const BankAccountsActions = bankAccountsSlice.actions;
export const bankAccountsReducer = bankAccountsSlice.reducer;
