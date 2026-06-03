'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';

export type AppLayoutBreadcrumb = {
  label: string;
  href?: string;
};

type AppLayoutHeaderProps = {
  isSidebarVisible: boolean;
  onToggleSidebar: () => void;
  breadcrumbItems: AppLayoutBreadcrumb[];
};

export const AppLayoutHeader = (props: AppLayoutHeaderProps) => {
  const { isSidebarVisible, onToggleSidebar, breadcrumbItems } = props;

  return (
    <header className={styles.header}>
      <button type="button" onClick={onToggleSidebar} className={styles.menuButton}>
        {isSidebarVisible ? 'Hide menu' : 'Show menu'}
      </button>
      <BreadcrumbBar items={breadcrumbItems} />
    </header>
  );
};

const BreadcrumbBar = ({ items }: { items: AppLayoutBreadcrumb[] }) => {
  if (items.length === 0) return null;
  return (
    <nav className={styles.breadcrumbNav}>
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className={styles.breadcrumbItem}>
          {index > 0 && <span className={styles.breadcrumbSeparator}>/</span>}
          {item.href ? (
            <Link href={item.href} className={styles.breadcrumbLink}>
              {item.label}
            </Link>
          ) : (
            <span className={styles.breadcrumbCurrent}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
};

export const useResolvedDashboardBreadcrumbs = (): AppLayoutBreadcrumb[] => {
  const trail = useAppSelector((state) => state.breadcrumbBuilder);

  return useMemo(() => {
    return trail.segments.map((segment) => {
      if (segment.kind === 'staticLink') {
        return { label: segment.label, href: segment.href };
      }
      return { label: segment.label };
    });
  }, [trail.segments]);
};

const styles = {
  header: `
    flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3
  `,
  menuButton: `
    rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50
  `,
  breadcrumbNav: `
    flex items-center gap-2 text-sm text-gray-600
  `,
  breadcrumbItem: `
    flex items-center gap-2
  `,
  breadcrumbSeparator: `
    text-gray-400
  `,
  breadcrumbLink: `
    hover:text-gray-900
  `,
  breadcrumbCurrent: `
    text-gray-900
  `,
} as const;
