import { CurrentStatementImportActions } from '@/store/current';
import type { StatementImport } from '@/model/statement-import';
import type { AppThunk } from '@/store/types';
import type { ThunkResult } from '@/store/thunks/thunk-result';

/**
 * Sets the current statement import for detail navigation.
 */
export const setCurrentStatementImportThunk =
  (statementImport: StatementImport): AppThunk<Promise<ThunkResult>> =>
  async (dispatch) => {
    dispatch(CurrentStatementImportActions.setCurrentStatementImport(statementImport));
    return { status: 200 };
  };
