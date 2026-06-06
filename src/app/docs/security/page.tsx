import type { Metadata } from 'next';
import Link from 'next/link';
import { DOCS_GETTING_STARTED_PATH } from '@/config/routes';
import { GITHUB_API_URL } from '@/packages/landing/content/landing-content';
import { docsArticleStyles as styles } from '@/packages/docs';

export const metadata: Metadata = {
  title: 'Security — Personal Finances',
  description:
    'Threat model, client storage, and deployment guidance for self-hosted Personal Finances.',
};

const OSS_AUDIT_NOTES_URL =
  'https://github.com/Luckee-Core/personal-finances/blob/main/docs/security/oss-audit-notes.md';

const OSS_GOVERNANCE_URL =
  'https://github.com/trouthouse-tech/mentorai-server/tree/main/data/open-source';

export default function SecurityPage() {
  return (
    <article className={styles.article}>
      <h1 className={styles.h1}>Security</h1>
      <p className={styles.lead}>
        Read this before pointing Personal Finances at anything beyond localhost. The OSS default
        assumes a <strong>trusted solo operator</strong> on their own machine.
      </p>

      <section className={styles.section}>
        <h2 className={styles.h2}>Supported use</h2>
        <p className={styles.p}>
          <strong>Local / trusted single-operator use</strong> is the primary assumption. You run
          Next.js and{' '}
          <a href={GITHUB_API_URL} className={styles.link} target="_blank" rel="noopener noreferrer">
            personal-finances-express-server
          </a>{' '}
          on your machine or a controlled network.
        </p>
        <p className={styles.p}>
          <strong>Before exposing this app or API on a LAN or the internet:</strong> add
          authentication and authorization, use HTTPS, configure Express CORS explicitly, and add
          rate limits on AI-backed routes.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Threat model</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Boundary</th>
              <th className={styles.th}>Assumption</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.td}>Operator</td>
              <td className={styles.td}>Trusted user on their own machine</td>
            </tr>
            <tr>
              <td className={styles.td}>Input</td>
              <td className={styles.td}>Financial CSV imports and manual entry are trusted</td>
            </tr>
            <tr>
              <td className={styles.td}>Network</td>
              <td className={styles.td}>
                Browser talks only to{' '}
                <code className={styles.code}>NEXT_PUBLIC_SERVER_URL</code> (your Express instance)
              </td>
            </tr>
            <tr>
              <td className={styles.td}>Secrets</td>
              <td className={styles.td}>
                No Supabase service keys or Anthropic keys in the browser bundle
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Client storage</h2>
        <p className={styles.p}>
          The web app stores one preference in <code className={styles.code}>localStorage</code>:
        </p>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Key</th>
              <th className={styles.th}>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.td}>
                <code className={styles.code}>personal-finances-sidebar-visible</code>
              </td>
              <td className={styles.td}>Dashboard sidebar open/closed preference</td>
            </tr>
          </tbody>
        </table>
        <p className={styles.p}>Values are booleans only; no credentials are stored in the browser.</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Secrets and env</h2>
        <ul className={styles.ul}>
          <li className={styles.li}>
            <code className={styles.code}>NEXT_PUBLIC_*</code> variables ship in the browser bundle.
            Never put Supabase service keys or Anthropic keys there.
          </li>
          <li className={styles.li}>
            The web app does not attach <code className={styles.code}>Authorization</code> headers;
            Express must enforce access control before wider deploy.
          </li>
        </ul>
        <p className={styles.p}>
          See <Link href={DOCS_GETTING_STARTED_PATH} className={styles.link}>Getting started</Link>{' '}
          for the env split between web and Express.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Reporting a vulnerability</h2>
        <p className={styles.p}>
          Do not post exploit details in public issues before a fix is coordinated. Use GitHub{' '}
          <strong>Report a vulnerability</strong> (Security tab) on the repository.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Audit resources</h2>
        <ul className={styles.ul}>
          <li className={styles.li}>
            <a
              href={OSS_GOVERNANCE_URL}
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              mentorai-server data/open-source/
            </a>{' '}
            — pre-release guides
          </li>
          <li className={styles.li}>
            <a
              href={OSS_AUDIT_NOTES_URL}
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              docs/security/oss-audit-notes.md
            </a>{' '}
            — web audit notes
          </li>
        </ul>
      </section>
    </article>
  );
}
