'use client';

import { useAppSelector } from '@/store/hooks';

export const BankAccountsTable = () => {
  const rows = useAppSelector((state) => Object.values(state.bankAccounts));
  const sorted = [...rows].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Type</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row.id} className={styles.row}>
              <td className={styles.td}>{row.name}</td>
              <td className={`${styles.td} capitalize`}>{row.account_type}</td>
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={2} className={styles.empty}>
                No bank accounts yet. Add one to assign transactions and imports.
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
  row: `
    border-t border-gray-100
  `,
  td: `
    px-4 py-2
  `,
  empty: `
    px-4 py-8 text-center text-gray-500
  `,
} as const;
