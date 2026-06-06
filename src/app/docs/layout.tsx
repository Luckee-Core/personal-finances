import type { ReactNode } from 'react';
import { getApiDocsCatalogCached } from '@/api/api-docs';
import { DocsCatalogProvider, DocsShell } from '@/packages/docs';
import { buildApiGroupSidebarChildren } from '@/utils/api-docs';

export default async function DocsLayout({ children }: { children: ReactNode }) {
  const result = await getApiDocsCatalogCached();
  const apiGroupNav = result.ok ? buildApiGroupSidebarChildren(result.data.groups) : [];

  return (
    <DocsCatalogProvider
      catalog={result.ok ? result.data : null}
      catalogStatus={result.ok ? 200 : result.status}
    >
      <DocsShell apiGroupNav={apiGroupNav}>{children}</DocsShell>
    </DocsCatalogProvider>
  );
}
