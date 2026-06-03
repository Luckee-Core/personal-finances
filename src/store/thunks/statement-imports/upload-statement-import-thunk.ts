import {
  uploadStatementImport,
  type UploadStatementImportTarget,
} from '@/api/statement-imports';
import { getAllTransactions } from '@/api/transactions';
import { StatementImportsActions, TransactionsActions } from '@/store/dumps';
import { rowsToEntityRecord } from '@/store/normalize';
import type { AppThunk } from '@/store/types';
import type { ThunkStatus } from '@/api/types';
import type { UploadStatementImportResult } from '@/api/statement-imports';

export type UploadStatementImportThunkResult =
  | { status: ThunkStatus; data: UploadStatementImportResult }
  | { status: ThunkStatus; errorMessage: string };

/**
 * Uploads a statement CSV, upserts the import record, and reloads transactions.
 */
export const uploadStatementImportThunk =
  (
    file: File,
    target: UploadStatementImportTarget,
  ): AppThunk<Promise<UploadStatementImportThunkResult>> =>
  async (dispatch) => {
    const result = await uploadStatementImport(file, target);
    if (!result.ok) {
      return {
        status: result.status >= 500 ? 500 : 400,
        errorMessage: result.error.message,
      };
    }

    dispatch(StatementImportsActions.upsertStatementImport(result.data.import));

    const transactions = await getAllTransactions();
    if (transactions.ok) {
      dispatch(TransactionsActions.setTransactions(rowsToEntityRecord(transactions.data)));
    }

    return { status: 200, data: result.data };
  };
