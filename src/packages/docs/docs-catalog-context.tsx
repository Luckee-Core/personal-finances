'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { ApiDocsCatalog } from '@/api/api-docs';

type DocsCatalogContextValue = {
  catalog: ApiDocsCatalog | null;
  catalogStatus: number;
};

const DocsCatalogContext = createContext<DocsCatalogContextValue | null>(null);

type DocsCatalogProviderProps = {
  children: ReactNode;
  catalog: ApiDocsCatalog | null;
  catalogStatus: number;
};

/**
 * Shares the docs layout catalog fetch with client descendants (sidebar + API page).
 */
export const DocsCatalogProvider = (props: DocsCatalogProviderProps) => {
  const { children, catalog, catalogStatus } = props;

  return (
    <DocsCatalogContext.Provider value={{ catalog, catalogStatus }}>
      {children}
    </DocsCatalogContext.Provider>
  );
};

/**
 * Reads the catalog snapshot loaded once in the docs layout.
 */
export const useDocsCatalog = (): DocsCatalogContextValue => {
  const value = useContext(DocsCatalogContext);
  if (!value) {
    throw new Error('useDocsCatalog must be used within DocsCatalogProvider');
  }
  return value;
};
