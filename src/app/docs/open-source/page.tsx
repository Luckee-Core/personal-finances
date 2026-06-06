import type { Metadata } from 'next';
import Link from 'next/link';
import { DOCS_API_PATH, DOCS_GETTING_STARTED_PATH } from '@/config/routes';
import {
  GITHUB_API_URL,
  GITHUB_WEB_URL,
  LANDING_REPOS,
} from '@/packages/landing/content/landing-content';
import { docsArticleStyles as styles } from '@/packages/docs';

export const metadata: Metadata = {
  title: 'Open source — Personal Finances',
  description:
    'Personal Finances open-source repositories: Next.js dashboard and Express API backed by Supabase.',
};

const OSS_GOVERNANCE_URL =
  'https://github.com/trouthouse-tech/mentorai-server/tree/main/data/open-source';

export default function OpenSourcePage() {
  return (
    <article className={styles.article}>
      <h1 className={styles.h1}>Open source</h1>
      <p className={styles.lead}>
        Personal Finances ships as a <strong>web + Express pair</strong>. For ports, env files, and
        first run, start with{' '}
        <Link href={DOCS_GETTING_STARTED_PATH} className={styles.link}>
          Getting started
        </Link>
        . Each GitHub README is the source of truth for install and configuration.
      </p>

      <section className={styles.section}>
        <h2 className={styles.h2}>Repositories</h2>
        <ul className={styles.ul}>
          {LANDING_REPOS.map((repo) => (
            <li key={repo.name} className={styles.li}>
              <strong>{repo.name}</strong> ({repo.tag}) — {repo.desc}{' '}
              <a href={repo.href} className={styles.link} target="_blank" rel="noopener noreferrer">
                GitHub →
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Web repo layout</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Path</th>
              <th className={styles.th}>What lives here</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.td}>
                <code className={styles.code}>src/app</code>
              </td>
              <td className={styles.td}>App Router pages (thin wrappers)</td>
            </tr>
            <tr>
              <td className={styles.td}>
                <code className={styles.code}>src/packages</code>
              </td>
              <td className={styles.td}>Feature modules (transactions, dashboard, docs, …)</td>
            </tr>
            <tr>
              <td className={styles.td}>
                <code className={styles.code}>src/api</code>
              </td>
              <td className={styles.td}>Express HTTP clients</td>
            </tr>
            <tr>
              <td className={styles.td}>
                <code className={styles.code}>src/store</code>
              </td>
              <td className={styles.td}>Redux slices and manual thunks</td>
            </tr>
            <tr>
              <td className={styles.td}>
                <code className={styles.code}>.cursor/architecture</code>
              </td>
              <td className={styles.td}>Architecture decision records (ADRs)</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Express API surface</h2>
        <p className={styles.p}>
          The API mounts <code className={styles.code}>/api/data/*</code> for entity CRUD (bank
          accounts, transactions, categories, recurring purchases, loans, statement imports, AI audit
          tables) and <code className={styles.code}>/api/ai/*</code> for AI workers (slug assign,
          category assign, recurring detect). See the{' '}
          <Link href={DOCS_API_PATH} className={styles.link}>
            API reference
          </Link>{' '}
          for the live catalog.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>OSS governance</h2>
        <p className={styles.p}>
          Release readiness and replication checklists live in the mentorai-server open-source pack:{' '}
          <a
            href={OSS_GOVERNANCE_URL}
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            data/open-source/
          </a>
          .
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Clone links</h2>
        <ul className={styles.ul}>
          <li className={styles.li}>
            <a href={GITHUB_WEB_URL} className={styles.link} target="_blank" rel="noopener noreferrer">
              {GITHUB_WEB_URL}
            </a>
          </li>
          <li className={styles.li}>
            <a href={GITHUB_API_URL} className={styles.link} target="_blank" rel="noopener noreferrer">
              {GITHUB_API_URL}
            </a>
          </li>
        </ul>
      </section>
    </article>
  );
}
