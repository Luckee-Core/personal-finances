import {
  DOCS_GETTING_STARTED_PATH,
  DOCS_OPEN_SOURCE_PATH,
  DOCS_SECURITY_PATH,
} from '@/config/routes';

export type DocsSidebarLeaf = {
  name: string;
  href: string;
};

export type DocsSidebarNested = {
  kind: 'nested';
  name: string;
  href: string;
  children: DocsSidebarLeaf[];
};

export type DocsSidebarLink = {
  kind: 'link';
  name: string;
  href: string;
};

export type DocsSidebarLabel = {
  kind: 'label';
  text: string;
};

export type DocsSidebarEntry = DocsSidebarNested | DocsSidebarLink | DocsSidebarLabel;

/**
 * Static prose docs links (Guides column).
 */
export const DOCS_SIDEBAR_GUIDES: DocsSidebarEntry[] = [
  { kind: 'link', name: 'Getting started', href: DOCS_GETTING_STARTED_PATH },
  { kind: 'link', name: 'Open source', href: DOCS_OPEN_SOURCE_PATH },
  { kind: 'link', name: 'Security', href: DOCS_SECURITY_PATH },
];
