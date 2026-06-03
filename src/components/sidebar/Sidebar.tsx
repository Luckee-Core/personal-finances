'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getSidebarSections } from './get-sidebar-sections';

const isActive = (pathname: string, href: string, prefix?: string | string[]): boolean => {
  if (pathname === href) return true;
  const prefixes = prefix ? (Array.isArray(prefix) ? prefix : [prefix]) : [href];
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
};

export const Sidebar = () => {
  const pathname = usePathname();
  const sections = getSidebarSections();

  return (
    <aside className={styles.aside}>
      <div className={styles.brand}>
        <p className={styles.brandTitle}>Personal Finances</p>
      </div>
      <nav className={styles.nav}>
        {sections.map((section) => (
          <div key={section.title}>
            <p className={styles.sectionTitle}>{section.title}</p>
            <ul className={styles.linkList}>
              {section.links.map((link) => {
                const active = isActive(pathname, link.href, link.activePathPrefix);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={active ? styles.linkActive : styles.link}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

const styles = {
  aside: `
    w-56 shrink-0 border-r border-gray-200 bg-white h-full overflow-y-auto
  `,
  brand: `
    px-4 py-5 border-b border-gray-100
  `,
  brandTitle: `
    text-sm font-semibold text-gray-900
  `,
  nav: `
    px-3 py-4 space-y-6
  `,
  sectionTitle: `
    px-2 mb-2 text-xs font-medium uppercase tracking-wide text-gray-500
  `,
  linkList: `
    space-y-1
  `,
  link: `
    block rounded-md px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900
  `,
  linkActive: `
    block rounded-md px-2 py-1.5 text-sm bg-gray-100 font-medium text-gray-900
  `,
} as const;
