'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LANDING_BRAND_NAME } from '@/packages/landing/content/landing-content';
import {
  DOCS_SIDEBAR_GUIDES,
  type DocsSidebarEntry,
  type DocsSidebarLeaf,
  type DocsSidebarNested,
} from '@/packages/docs/navigation';

const getHrefHash = (href: string): string => {
  const hashIndex = href.indexOf('#');
  return hashIndex === -1 ? '' : href.slice(hashIndex);
};

const isNestedSectionActive = (entry: DocsSidebarNested, pathname: string): boolean => {
  if (pathname === entry.href || pathname.startsWith(`${entry.href}/`)) {
    return true;
  }
  return entry.children.some((child) => {
    const childPath = child.href.split('#')[0];
    return pathname === childPath || pathname.startsWith(`${childPath}/`);
  });
};

const isChildActive = (child: DocsSidebarLeaf, pathname: string, hash: string): boolean => {
  const childPath = child.href.split('#')[0];
  const childHash = getHrefHash(child.href);
  if (pathname !== childPath) {
    return false;
  }
  if (childHash) {
    return hash === childHash;
  }
  return !hash;
};

type RenderEntryArgs = {
  entry: DocsSidebarEntry;
  pathname: string;
  hash: string;
};

const renderGuideEntry = (args: RenderEntryArgs) => {
  const { entry, pathname, hash } = args;

  if (entry.kind === 'label') {
    return (
      <li key={entry.text} className={styles.labelRow}>
        <p className={styles.sectionLabel}>{entry.text}</p>
      </li>
    );
  }

  if (entry.kind === 'link') {
    const active = pathname === entry.href;
    return (
      <li key={entry.href}>
        <Link href={entry.href} prefetch={false} className={active ? styles.linkActive : styles.link}>
          {entry.name}
        </Link>
      </li>
    );
  }

  const sectionActive = isNestedSectionActive(entry, pathname);
  const parentExactlyActive = pathname === entry.href && !hash;

  return (
    <li key={entry.name}>
      <Link
        href={entry.href}
        prefetch={false}
        className={
          parentExactlyActive ? styles.linkActive : sectionActive ? styles.linkInSection : styles.link
        }
      >
        {entry.name}
      </Link>
      {entry.children.length > 0 ? (
        <ul className={styles.nestedList} aria-label={`${entry.name} sections`}>
          {entry.children.map((child) => {
            const childActive = isChildActive(child, pathname, hash);
            const childHash = getHrefHash(child.href);
            const useAnchor = childHash.length > 0;

            return (
              <li key={child.href}>
                {useAnchor ? (
                  <a
                    href={child.href}
                    className={childActive ? styles.nestedLinkActive : styles.nestedLink}
                  >
                    {child.name}
                  </a>
                ) : (
                  <Link
                    href={child.href}
                    prefetch={false}
                    className={childActive ? styles.nestedLinkActive : styles.nestedLink}
                  >
                    {child.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      ) : null}
    </li>
  );
};

const renderApiEntity = (entity: DocsSidebarLeaf, pathname: string, hash: string) => {
  const entityHash = getHrefHash(entity.href);
  const entityPath = entity.href.split('#')[0];
  const active = pathname === entityPath && hash === entityHash;

  return (
    <li key={entity.href}>
      <a href={entity.href} className={active ? styles.linkActive : styles.link}>
        {entity.name}
      </a>
    </li>
  );
};

type DocsSidebarProps = {
  apiGroupNav: DocsSidebarLeaf[];
};

/**
 * Persistent docs navigation sidebar with active route highlighting.
 */
export const DocsSidebar = (props: DocsSidebarProps) => {
  const { apiGroupNav } = props;
  const pathname = usePathname();
  const [hash, setHash] = useState('');

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, [pathname]);

  const guideItems = useMemo(
    () =>
      DOCS_SIDEBAR_GUIDES.map((entry) => renderGuideEntry({ entry, pathname, hash })),
    [pathname, hash],
  );

  const apiItems = useMemo(
    () => apiGroupNav.map((entity) => renderApiEntity(entity, pathname, hash)),
    [apiGroupNav, pathname, hash],
  );

  return (
    <aside className={styles.sidebar}>
      <div className={styles.inner}>
        <Link href="/" prefetch={false} className={styles.brand}>
          <span className={styles.logoMark}>P</span>
          <span className={styles.brandTextBlock}>
            <span className={styles.brandTitle}>{LANDING_BRAND_NAME}</span>
            <span className={styles.brandSub}>Documentation</span>
          </span>
        </Link>
        <nav className={styles.nav} aria-label="Guides">
          <p className={styles.sectionLabel}>Guides</p>
          <ul className={styles.list}>{guideItems}</ul>
        </nav>
        <nav className={styles.nav} aria-label="API">
          <p className={styles.sectionLabel}>API</p>
          <ul className={styles.list}>{apiItems}</ul>
          {apiGroupNav.length === 0 ? (
            <p className={styles.apiHint}>Start Express to load API entities.</p>
          ) : null}
        </nav>
        <Link href="/" prefetch={false} className={styles.back}>
          ← Back to site
        </Link>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: `
    w-full shrink-0 border-b border-border bg-muted/40
    lg:w-56 lg:border-b-0 lg:border-r
  `,
  inner: `flex flex-col gap-6 p-4 lg:sticky lg:top-0 lg:h-screen lg:max-h-screen lg:overflow-y-auto`,
  brand: `flex items-center gap-2`,
  logoMark: `
    flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground
  `,
  brandTextBlock: `flex min-w-0 flex-col leading-tight`,
  brandTitle: `text-sm font-semibold text-foreground tracking-tight truncate`,
  brandSub: `text-xs text-muted-foreground truncate`,
  nav: `flex flex-col gap-2`,
  sectionLabel: `text-[11px] font-mono uppercase tracking-[0.12em] text-muted-foreground`,
  list: `flex flex-col gap-0.5`,
  labelRow: `mt-1 list-none first:mt-0`,
  nestedList: `ml-2 mt-0.5 flex flex-col gap-0.5 border-l border-border pl-2`,
  link: `
    rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors
    hover:bg-muted hover:text-foreground
  `,
  linkInSection: `
    rounded-md px-2 py-1.5 text-sm font-medium text-foreground transition-colors
    hover:bg-muted
  `,
  linkActive: `
    rounded-md bg-muted px-2 py-1.5 text-sm font-medium text-foreground
  `,
  nestedLink: `
    rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors
    hover:bg-muted hover:text-foreground
  `,
  nestedLinkActive: `
    rounded-md bg-muted px-2 py-1.5 text-xs font-medium text-foreground
  `,
  apiHint: `text-xs text-muted-foreground leading-relaxed`,
  back: `text-xs text-muted-foreground hover:text-foreground transition-colors mt-auto`,
};
