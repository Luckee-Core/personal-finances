import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { StatementImport } from '@/model/statement-import';

export const currentStatementImportSlice = createSlice({
  name: 'currentStatementImport',
  initialState: null as StatementImport | null,
  reducers: {
    setCurrentStatementImport: (_state, action: PayloadAction<StatementImport | null>) =>
      action.payload,
    clearCurrentStatementImport: () => null,
  },
});

export const CurrentStatementImportActions = currentStatementImportSlice.actions;
export const currentStatementImportReducer = currentStatementImportSlice.reducer;
