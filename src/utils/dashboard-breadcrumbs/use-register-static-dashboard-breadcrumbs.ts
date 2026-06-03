'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import type { AppLayoutBreadcrumb } from '@/components/app-layout-header';
import { useAppDispatch } from '@/store/hooks';
import {
  resetDashboardBreadcrumbTrail,
  setStaticDashboardBreadcrumbTrail,
} from './set-static-dashboard-breadcrumb-trail';

export const useRegisterStaticDashboardBreadcrumbs = (
  legacyBreadcrumbs: AppLayoutBreadcrumb[],
): void => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setStaticDashboardBreadcrumbTrail(dispatch, legacyBreadcrumbs);
    return () => resetDashboardBreadcrumbTrail(dispatch);
  }, [dispatch, pathname, legacyBreadcrumbs]);
};
