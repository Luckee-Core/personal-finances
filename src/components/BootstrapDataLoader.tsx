'use client';

import { useEffect } from 'react';
import { loadBootstrapDataThunk } from '@/store/thunks/bootstrap/load-bootstrap-data-thunk';
import { useAppDispatch } from '@/store/hooks';

export const BootstrapDataLoader = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(loadBootstrapDataThunk());
  }, [dispatch]);

  return <>{children}</>;
};
