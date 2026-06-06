import type { Metadata } from 'next';
import Link from 'next/link';
import { DOCS_API_PATH, DOCS_OPEN_SOURCE_PATH } from '@/config/routes';
import {
  GITHUB_API_URL,
  GITHUB_WEB_URL,
} from '@/packages/landing/content/landing-content';
import { docsArticleStyles as styles } from '@/packages/docs';

export const metadata: Metadata = {
  title: 'Getting started — Personal Finances',
  description:
    'Run the Personal Finances web app and Express API locally: clone both repos, configure env, and smoke-test the stack.',
};

const EXPRESS_DATABASE_SETUP_URL =
  'https://github.com/Luckee-Core/personal-finances-express-server/blob/main/docs/database-setup.md';

export default function GettingStartedPage() {
  return (
    <article className={styles.article}>
      <h1 className={styles.h1}>Getting started</h1>
      <p className={styles.lead}>
        Personal Finances is a <strong>self-hosted money dashboard</strong> for solo operators who
        want CSV imports, editable AI prompts, and recurring cost tracking on <strong>their</strong>{' '}
        Supabase project — not a SaaS ledger. This page walks through running the{' '}
        <strong>web + Express pair</strong> locally.
      </p>

      <section className={styles.section}>
        <h2 className={styles.h2}>What you are running</h2>
        <p className={styles.p}>
          Self-hosted Personal Finances is <strong>two repositories</strong>: a{' '}
          <strong>Next.js</strong> dashboard (TypeScript, Redux) and an <strong>Express</strong> API
          for <code className={styles.code}>/api/data</code> CRUD and{' '}
          <code className={styles.code}>/api/ai</code> workers. Clone both, configure environment
          variables, and keep both processes running while you develop.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Wire contract</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Field</th>
              <th className={styles.th}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.td}>Default web port</td>
              <td className={styles.td}>
                <code className={styles.code}>3000</code>
              </td>
            </tr>
            <tr>
              <td className={styles.td}>Default API port</td>
              <td className={styles.td}>
                <code className={styles.code}>3011</code>
              </td>
            </tr>
            <tr>
              <td className={styles.td}>API base env (web)</td>
              <td className={styles.td}>
                <code className={styles.code}>NEXT_PUBLIC_SERVER_URL</code>
              </td>
            </tr>
            <tr>
              <td className={styles.td}>Health endpoint</td>
              <td className={styles.td}>
                <code className={styles.code}>GET /api/health</code>
              </td>
            </tr>
            <tr>
              <td className={styles.td}>Success JSON</td>
              <td className={styles.td}>
                <code className={styles.code}>{'{ success: true, data?, count?, message? }'}</code>
              </td>
            </tr>
            <tr>
              <td className={styles.td}>Auth (OSS default)</td>
              <td className={styles.td}>None — local/trusted operator</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>1. Express API</h2>
        <p className={styles.p}>
          Start the API first. Apply database SQL per the Express{' '}
          <a
            href={EXPRESS_DATABASE_SETUP_URL}
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            database setup guide
          </a>
          .
        </p>
        <pre className={styles.codeBlock}>
          {`cd personal-finances-express-server
cp .env.example .env
# Fill SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
# Optional: ANTHROPIC_API_KEY for AI features

npm install
npm run dev`}
        </pre>
        <p className={styles.p}>
          Default listen: <code className={styles.code}>http://localhost:3011</code>. Verify with{' '}
          <code className={styles.code}>curl http://localhost:3011/api/health</code>.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>2. Web app</h2>
        <pre className={styles.codeBlock}>
          {`cd personal-finances
cp .env.example .env.local

npm install
npm run dev`}
        </pre>
        <p className={styles.p}>
          Set in <code className={styles.code}>.env.local</code>:
        </p>
        <pre className={styles.codeBlock}>
          {`NEXT_PUBLIC_SERVER_URL=http://localhost:3011`}
        </pre>
        <p className={styles.p}>
          Open <code className={styles.code}>http://localhost:3000</code> for the landing page;
          dashboard routes live under <code className={styles.code}>/dashboard</code>.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>3. Smoke test</h2>
        <ol className={styles.ol}>
          <li className={styles.li}>
            Express health returns success:{' '}
            <code className={styles.code}>curl http://localhost:3011/api/health</code>
          </li>
          <li className={styles.li}>
            API catalog returns 16 groups:{' '}
            <code className={styles.code}>
              curl -s http://localhost:3011/api-docs.json | jq &apos;.data.groups | length&apos;
            </code>
          </li>
          <li className={styles.li}>
            Open <Link href={DOCS_API_PATH} className={styles.link}>API reference</Link> — sidebar
            API section lists catalog groups (Express must be running).
          </li>
          <li className={styles.li}>Web dashboard loads transactions and categories.</li>
          <li className={styles.li}>
            Create a category or transaction — confirm{' '}
            <code className={styles.code}>{'{ success: true }'}</code> in the network tab.
          </li>
          <li className={styles.li}>
            (Optional) Upload a CSV statement import with Supabase and Anthropic configured.
          </li>
        </ol>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Where to go next</h2>
        <ul className={styles.ul}>
          <li className={styles.li}>
            <Link href={DOCS_OPEN_SOURCE_PATH} className={styles.link}>
              Open source
            </Link>{' '}
            — repository links and repo layout
          </li>
          <li className={styles.li}>
            <Link href={DOCS_API_PATH} className={styles.link}>
              API reference
            </Link>{' '}
            — HTTP catalog from Express (requires API running)
          </li>
          <li className={styles.li}>
            <a href={GITHUB_WEB_URL} className={styles.link} target="_blank" rel="noopener noreferrer">
              personal-finances on GitHub
            </a>{' '}
            — web README for env details
          </li>
          <li className={styles.li}>
            <a href={GITHUB_API_URL} className={styles.link} target="_blank" rel="noopener noreferrer">
              personal-finances-express-server on GitHub
            </a>{' '}
            — API README and SQL migrations
          </li>
        </ul>
      </section>
    </article>
  );
}
