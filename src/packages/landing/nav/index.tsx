'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { LandingGitHubIcon } from '../components/github-icon';
import { HOME_PATH } from '@/config/routes';
import {
  DOCS_URL,
  GITHUB_WEB_URL,
  LANDING_BRAND_NAME,
} from '../content/landing-content';

type NavLink = {
  href: string;
  label: string;
  external?: boolean;
};

const NAV_LINKS: NavLink[] = [
  { href: '#features', label: 'Features' },
  { href: '#open-source', label: 'Open Source' },
  { href: DOCS_URL, label: 'Docs' },
  { href: GITHUB_WEB_URL, label: 'GitHub', external: true },
];

export const LandingNav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="#top" className={styles.brand} onClick={() => setMobileOpen(false)}>
          <span className={styles.logo}>P</span>
          <span className={styles.brandName}>{LANDING_BRAND_NAME}</span>
        </a>

        <nav className={styles.desktopNav} aria-label="Main">
          {NAV_LINKS.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.navLink}
              >
                {link.label}
              </a>
            ) : (
              <a key={link.label} href={link.href} className={styles.navLink}>
                {link.label}
              </a>
            ),
          )}
        </nav>

        <div className={styles.actions}>
          <a href={DOCS_URL} className={styles.selfHostLink}>
            Self-host guide
          </a>
          <a
            href={GITHUB_WEB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubBtn}
          >
            <LandingGitHubIcon className={styles.githubIcon} />
            View on GitHub
          </a>
          <button
            type="button"
            className={styles.menuBtn}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className={styles.menuIcon} /> : <Menu className={styles.menuIcon} />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className={styles.mobilePanel}>
          <nav className={styles.mobileNav} aria-label="Mobile">
            {NAV_LINKS.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mobileLink}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className={styles.mobileLink}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ),
            )}
            <Link
              href={HOME_PATH}
              className={styles.mobileDashboard}
              onClick={() => setMobileOpen(false)}
            >
              Open dashboard
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
};

const styles = {
  header: `
    sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md
  `,
  inner: `
    mx-auto flex h-16 max-w-6xl items-center justify-between px-6
    lg:px-8
  `,
  brand: `
    flex items-center gap-2
  `,
  logo: `
    flex h-7 w-7 items-center justify-center rounded-md bg-primary font-mono text-sm font-bold
    text-primary-foreground
  `,
  brandName: `
    font-semibold tracking-tight
  `,
  desktopNav: `
    hidden items-center gap-8
    md:flex
  `,
  navLink: `
    text-sm text-muted-foreground transition-colors hover:text-foreground
  `,
  actions: `
    flex items-center gap-2
  `,
  selfHostLink: `
    hidden text-sm text-muted-foreground transition-colors hover:text-foreground
    sm:inline
  `,
  githubBtn: `
    hidden items-center gap-2 rounded-md border border-border bg-background px-3.5 py-1.5 text-sm
    font-medium transition-colors hover:border-foreground/30 hover:bg-secondary
    sm:inline-flex
  `,
  githubIcon: `
    h-4 w-4
  `,
  menuBtn: `
    inline-flex items-center justify-center rounded-md p-2 text-foreground transition-colors
    hover:bg-secondary
    md:hidden
  `,
  menuIcon: `
    h-5 w-5
  `,
  mobilePanel: `
    border-t border-border bg-background px-6 py-4
    md:hidden
  `,
  mobileNav: `
    flex flex-col gap-3
  `,
  mobileLink: `
    text-sm font-medium text-foreground
  `,
  mobileDashboard: `
    mt-2 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium
    text-primary-foreground transition-colors hover:bg-primary-hover
  `,
} as const;
