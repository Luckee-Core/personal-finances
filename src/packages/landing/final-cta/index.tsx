import { GITHUB_API_URL, GITHUB_WEB_URL } from '../content/landing-content';

export const LandingFinalCta = () => {
  return (
    <section className={styles.section}>
      <div className={styles.gridOverlay} aria-hidden />
      <div className={styles.inner}>
        <p className={styles.kicker}>Get started</p>
        <h2 className={styles.heading}>
          Clone it. Run it on your machine.{' '}
          <span className={styles.accent}>Keep the prompts.</span>
        </h2>
        <div className={styles.ctaRow}>
          <a
            href={GITHUB_WEB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaPrimary}
          >
            GitHub
          </a>
          <a
            href={GITHUB_WEB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaGhost}
          >
            Readme
          </a>
          <a
            href={GITHUB_API_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaGhost}
          >
            Express server
          </a>
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: `
    relative overflow-hidden bg-foreground text-white
  `,
  gridOverlay: `
    absolute inset-0 grid-overlay-dark
  `,
  inner: `
    relative mx-auto max-w-6xl px-6 py-28 text-center
    lg:px-8
    lg:py-36
  `,
  kicker: `
    mono-label text-primary
  `,
  heading: `
    mt-6 text-4xl font-semibold tracking-tight
    sm:text-6xl
  `,
  accent: `
    text-primary
  `,
  ctaRow: `
    mt-10 flex flex-wrap justify-center gap-3
  `,
  ctaPrimary: `
    inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium
    text-primary-foreground transition-colors hover:bg-primary-hover
  `,
  ctaGhost: `
    inline-flex items-center gap-2 rounded-md border border-white/20 bg-transparent px-5 py-3
    text-sm font-medium text-white transition-colors hover:bg-white/5
  `,
} as const;
