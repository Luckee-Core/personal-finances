'use client';

import { useRouter } from 'next/navigation';
import { STATEMENT_IMPORT_DETAIL_PATH } from '@/config/routes';
import type { StatementImport } from '@/model/statement-import';
import { setCurrentStatementImportThunk } from '@/store/thunks/statement-imports';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export const StatementImportsTable = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const rows = useAppSelector((state) => Object.values(state.statementImports));
  const sorted = [...rows].sort((a, b) => b.created_at.localeCompare(a.created_at));

  const openDetail = (row: StatementImport) => {
    dispatch(setCurrentStatementImportThunk(row));
    router.push(STATEMENT_IMPORT_DETAIL_PATH);
  };

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>File</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th}>Imported</th>
            <th className={styles.th}>Skipped</th>
            <th className={styles.th}>Created</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row.id} className={styles.clickableRow} onClick={() => openDetail(row)}>
              <td className={styles.td}>{row.filename}</td>
              <td className={`${styles.td} capitalize`}>{row.status}</td>
              <td className={styles.td}>{row.rows_imported}</td>
              <td className={styles.td}>{row.rows_skipped}</td>
              <td className={styles.td}>{new Date(row.created_at).toLocaleString()}</td>
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={5} className={styles.empty}>
                No imports yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  wrapper: `
    overflow-hidden rounded-lg border border-gray-200 bg-white
  `,
  table: `
    min-w-full text-sm
  `,
  thead: `
    bg-gray-50 text-left text-gray-600
  `,
  th: `
    px-4 py-2 font-medium
  `,
  clickableRow: `
    border-t border-gray-100 hover:bg-gray-50 cursor-pointer
  `,
  td: `
    px-4 py-2
  `,
  empty: `
    px-4 py-8 text-center text-gray-500
  `,
} as const;
