'use client';

import { useDocsCatalog } from '@/packages/docs/docs-catalog-context';
import { ApiDocsContent } from './api-docs-content';
import { ApiDocsUnavailable } from './api-docs-unavailable';

/**
 * Client view for /docs/api — reads catalog from docs layout provider (single fetch).
 */
export const ApiDocsView = () => {
  const { catalog, catalogStatus } = useDocsCatalog();

  if (!catalog) {
    return <ApiDocsUnavailable status={catalogStatus} />;
  }

  return <ApiDocsContent catalog={catalog} />;
};
