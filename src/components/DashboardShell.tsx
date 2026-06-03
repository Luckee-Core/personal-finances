'use client';

import { AppLayout } from './AppLayout';
import { BootstrapDataLoader } from './BootstrapDataLoader';

type DashboardShellProps = {
  children: React.ReactNode;
};

export const DashboardShell = ({ children }: DashboardShellProps) => {
  return (
    <BootstrapDataLoader>
      <AppLayout>{children}</AppLayout>
    </BootstrapDataLoader>
  );
};
