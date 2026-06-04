import { LandingGitHubIcon } from '../components/github-icon';
import { GITHUB_WEB_URL, LANDING_BRAND_NAME, THT_URL } from '../content/landing-content';

export const LandingFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandRow}>
          <span className={styles.logo}>P</span>
          <span className={styles.brandName}>{LANDING_BRAND_NAME}</span>
          <span className={styles.license}>MIT</span>
        </div>
        <div className={styles.links}>
          <a
            href={GITHUB_WEB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubLink}
          >
            <LandingGitHubIcon className={styles.githubIcon} />
            GitHub
          </a>
          <span>
            Built by{' '}
            <a href={THT_URL} target="_blank" rel="noopener noreferrer" className={styles.thtLink}>
              TroutHouseTech
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: `
    border-t border-border bg-background
  `,
  inner: `
    mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-10
    sm:flex-row sm:items-center
    lg:px-8
  `,
  brandRow: `
    flex items-center gap-2
  `,
  logo: `
    flex h-6 w-6 items-center justify-center rounded bg-primary font-mono text-xs font-bold
    text-primary-foreground
  `,
  brandName: `
    text-sm font-medium
  `,
  license: `
    mono-label ml-2 text-muted-foreground
  `,
  links: `
    flex items-center gap-6 text-sm text-muted-foreground
  `,
  githubLink: `
    inline-flex items-center gap-1.5 transition-colors hover:text-foreground
  `,
  githubIcon: `
    h-4 w-4
  `,
  thtLink: `
    text-foreground hover:text-primary
  `,
} as const;
