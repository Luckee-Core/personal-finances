'use client';

import type { ReactNode } from 'react';
import type { DocsSidebarLeaf } from '@/packages/docs/navigation';
import { DocsSidebar } from './sidebar';

type DocsShellProps = {
  children: ReactNode;
  apiGroupNav: DocsSidebarLeaf[];
};

/**
 * Docs layout shell: sticky sidebar + scrollable main content.
 */
export const DocsShell = (props: DocsShellProps) => {
  const { children, apiGroupNav } = props;

  return (
    <div className={styles.root}>
      <DocsSidebar apiGroupNav={apiGroupNav} />
      <div className={styles.main}>{children}</div>
    </div>
  );
};

const styles = {
  root: `
    min-h-screen bg-background text-foreground flex flex-col
    lg:flex-row
  `,
  main: `
    min-w-0 flex-1 px-6 py-10
    lg:px-12 lg:py-12
  `,
};
