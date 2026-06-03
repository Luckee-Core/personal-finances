import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { StatementImport } from '@/model/statement-import';

const initialState: Record<string, StatementImport> = {};

export const statementImportsSlice = createSlice({
  name: 'statementImports',
  initialState,
  reducers: {
    setStatementImports: (
      _state,
      action: PayloadAction<Record<string, StatementImport>>,
    ) => action.payload,
    upsertStatementImport: (state, action: PayloadAction<StatementImport>) => {
      state[action.payload.id] = action.payload;
    },
  },
});

export const StatementImportsActions = statementImportsSlice.actions;
export const statementImportsReducer = statementImportsSlice.reducer;
