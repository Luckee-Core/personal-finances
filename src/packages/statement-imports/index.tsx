'use client';

import { StatementImportUploadPanel } from './upload-panel';
import { StatementImportsTable } from './table';

export const StatementImportsPage = () => {
  return (
    <div className={styles.page}>
      <div>
        <h1 className={styles.title}>Statement imports</h1>
        <p className={styles.subtitle}>Upload CSV exports and review import history.</p>
      </div>
      <StatementImportUploadPanel />
      <StatementImportsTable />
    </div>
  );
};

const styles = {
  page: `
    space-y-6
  `,
  title: `
    text-2xl font-semibold text-gray-900
  `,
  subtitle: `
    text-sm text-gray-600
  `,
} as const;
