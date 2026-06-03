import { CurrentStatementImportActions } from '@/store/current';
import type { StatementImport } from '@/model/statement-import';
import type { AppThunk } from '@/store/types';
import type { ThunkStatus } from '@/api/types';

/**
 * Sets the current statement import for detail navigation.
 */
export const setCurrentStatementImportThunk =
  (statementImport: StatementImport): AppThunk<ThunkStatus> =>
  (dispatch) => {
    dispatch(CurrentStatementImportActions.setCurrentStatementImport(statementImport));
    return 200;
  };
