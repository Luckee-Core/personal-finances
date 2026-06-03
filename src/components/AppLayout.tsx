'use client';

import { usePathname } from 'next/navigation';
import { useLayoutEffect, useMemo, useState } from 'react';
import {
  AppLayoutHeader,
  type AppLayoutBreadcrumb,
  useResolvedDashboardBreadcrumbs,
} from './app-layout-header';
import { resolveDefaultNavBreadcrumbForPathname } from './navigation';
import { Sidebar } from './sidebar';
import { BreadcrumbBuilderActions } from '@/store/builders';
import { useAppDispatch } from '@/store/hooks';

const SIDEBAR_VISIBLE_KEY = 'personal-finances-sidebar-visible';

const getStoredSidebarVisible = (): boolean => {
  if (typeof window === 'undefined') return true;
  try {
    const stored = localStorage.getItem(SIDEBAR_VISIBLE_KEY);
    if (stored === null) return true;
    return stored === 'true';
  } catch {
    return true;
  }
};

type AppLayoutProps = {
  children: React.ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const dispatch = useAppDispatch();
  const [isSidebarVisible, setIsSidebarVisible] = useState(getStoredSidebarVisible);
  const pathname = usePathname();

  useLayoutEffect(() => {
    dispatch(BreadcrumbBuilderActions.reset());
  }, [dispatch, pathname]);

  const defaultNavCrumb = useMemo(
    () => resolveDefaultNavBreadcrumbForPathname(pathname),
    [pathname],
  );

  const navOnlyBreadcrumbItems = useMemo((): AppLayoutBreadcrumb[] => {
    if (!defaultNavCrumb) return [];
    const item: AppLayoutBreadcrumb = { label: defaultNavCrumb.label };
    if (defaultNavCrumb.href) item.href = defaultNavCrumb.href;
    return [item];
  }, [defaultNavCrumb]);

  const reduxBreadcrumbItems = useResolvedDashboardBreadcrumbs();
  const breadcrumbItems = useMemo(
    () => (reduxBreadcrumbItems.length > 0 ? reduxBreadcrumbItems : navOnlyBreadcrumbItems),
    [reduxBreadcrumbItems, navOnlyBreadcrumbItems],
  );

  const handleToggleSidebar = () => {
    setIsSidebarVisible((previous) => {
      const next = !previous;
      try {
        localStorage.setItem(SIDEBAR_VISIBLE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <div className={styles.shell}>
      {isSidebarVisible && <Sidebar />}
      <div className={styles.main}>
        <AppLayoutHeader
          isSidebarVisible={isSidebarVisible}
          onToggleSidebar={handleToggleSidebar}
          breadcrumbItems={breadcrumbItems}
        />
        <div className={styles.content}>
          <div className={styles.contentInner}>{children}</div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  shell: `
    flex h-screen overflow-hidden bg-gray-50
  `,
  main: `
    flex flex-1 flex-col min-h-0 overflow-y-auto
  `,
  content: `
    flex-1 p-6
  `,
  contentInner: `
    mx-auto max-w-6xl
  `,
} as const;
