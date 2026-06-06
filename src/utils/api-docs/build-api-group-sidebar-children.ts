import type { ApiDocsGroup } from '@/api/api-docs';
import { DOCS_API_PATH } from '@/config/routes';
import type { DocsSidebarLeaf } from '@/packages/docs/navigation';
import { slugifyApiDocs } from './slugify-api-docs';

/**
 * Maps Express API catalog groups to flat sidebar hash links.
 */
export const buildApiGroupSidebarChildren = (groups: ApiDocsGroup[]): DocsSidebarLeaf[] =>
  groups.map((group) => ({
    name: group.name,
    href: `${DOCS_API_PATH}#group-${slugifyApiDocs(group.name)}`,
  }));
