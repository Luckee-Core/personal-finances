import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type TransactionFiltersState = {
  bankAccountId: string;
  categoryId: string;
  source: '' | 'manual' | 'import';
};

const initialState: TransactionFiltersState = {
  bankAccountId: '',
  categoryId: '',
  source: '',
};

export const transactionFiltersSlice = createSlice({
  name: 'transactionFilters',
  initialState,
  reducers: {
    setTransactionFilters: (state, action: PayloadAction<Partial<TransactionFiltersState>>) => ({
      ...state,
      ...action.payload,
    }),
    resetTransactionFilters: () => initialState,
  },
});

export const TransactionFiltersActions = transactionFiltersSlice.actions;
export const transactionFiltersReducer = transactionFiltersSlice.reducer;
