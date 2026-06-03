'use client';

import { useAppSelector } from '@/store/hooks';

export const CreditCardsTable = () => {
  const rows = useAppSelector((state) => Object.values(state.creditCards));
  const sorted = [...rows].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Issuer</th>
            <th className={styles.th}>Last four</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row.id} className={styles.row}>
              <td className={styles.td}>{row.name}</td>
              <td className={styles.td}>{row.issuer ?? '—'}</td>
              <td className={styles.td}>{row.last_four ?? '—'}</td>
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={3} className={styles.empty}>
                No credit cards yet. Add one to import card statements.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  wrapper: `overflow-x-auto rounded-lg border border-gray-200 bg-white`,
  table: `min-w-full text-sm`,
  thead: `bg-gray-50 text-left text-gray-600`,
  th: `px-4 py-2 font-medium`,
  row: `border-t border-gray-100`,
  td: `px-4 py-2`,
  empty: `px-4 py-8 text-center text-gray-500`,
} as const;
