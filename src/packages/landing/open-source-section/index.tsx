import { ArrowRight } from 'lucide-react';
import { LandingSectionLabel, LandingGitHubIcon } from '../components';
import { DOCS_URL, LANDING_REPOS } from '../content/landing-content';

export const LandingOpenSourceSection = () => {
  return (
    <section id="open-source" className={styles.section}>
      <div className={styles.inner}>
        <LandingSectionLabel number="05" label="Open source" />
        <div className={styles.grid}>
          <div className={styles.copy}>
            <h2 className={styles.heading}>A Next.js app and an Express data service.</h2>
            <p className={styles.lead}>
              Same patterns as Luckee studios. Supabase schema migrations, typed API boundaries, and
              a clear split between web and data.
            </p>
            <a href={DOCS_URL} id="docs" className={styles.docsLink}>
              Documentation
              <ArrowRight className={styles.docsIcon} />
            </a>
          </div>
          <div className={styles.repos}>
            {LANDING_REPOS.map((r) => (
              <a
                key={r.name}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.repoCard}
              >
                <div className={styles.repoHead}>
                  <LandingGitHubIcon className={styles.repoIcon} />
                  <span className={styles.repoTag}>{r.tag}</span>
                </div>
                <div className={styles.repoName}>{r.name}</div>
                <p className={styles.repoDesc}>{r.desc}</p>
                <div className={styles.repoHover}>
                  View repo <ArrowRight className={styles.repoHoverIcon} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: `
    border-b border-border bg-secondary/30
  `,
  inner: `
    mx-auto max-w-6xl px-6 py-24
    lg:px-8
    lg:py-32
  `,
  grid: `
    mt-6 grid grid-cols-1 gap-12
    lg:grid-cols-12 lg:gap-16
  `,
  copy: `
    lg:col-span-5
  `,
  heading: `
    text-4xl font-semibold tracking-tight
    sm:text-5xl
  `,
  lead: `
    mt-6 text-lg text-muted-foreground
  `,
  docsLink: `
    mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors
    hover:text-primary-hover
  `,
  docsIcon: `
    h-4 w-4
  `,
  repos: `
    grid grid-cols-1 gap-4
    sm:grid-cols-2
    lg:col-span-7
  `,
  repoCard: `
    group rounded-xl border border-border bg-card p-6 shadow-sm transition-all
    hover:border-primary/40 hover:shadow-md
  `,
  repoHead: `
    flex items-center justify-between
  `,
  repoIcon: `
    h-5 w-5 text-foreground
  `,
  repoTag: `
    mono-label text-muted-foreground
  `,
  repoName: `
    mt-5 font-mono text-sm font-semibold
  `,
  repoDesc: `
    mt-2 text-sm text-muted-foreground
  `,
  repoHover: `
    mt-6 inline-flex items-center gap-1 text-xs text-primary opacity-0 transition-opacity
    group-hover:opacity-100
  `,
  repoHoverIcon: `
    h-3 w-3
  `,
} as const;
