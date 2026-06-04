import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HOME_PATH } from '@/config/routes';
import { LANDING_HERO_KICKER, LANDING_HERO_STATS } from '../content/landing-content';

export const LandingHero = () => {
  return (
    <section id="top" className={styles.section}>
      <div className={styles.gridOverlay} aria-hidden />
      <div className={styles.topLine} aria-hidden />
      <div className={styles.inner}>
        <p className={styles.kicker}>{LANDING_HERO_KICKER}</p>
        <h1 className={styles.heading}>
          Know where your money goes{' '}
          <span className={styles.accent}>before the month ends.</span>
        </h1>
        <p className={styles.sub}>
          Import bank and credit CSVs, categorize with your own prompts, track recurring bills,
          loans, and planned costs — on your stack, your data.
        </p>
        <div className={styles.ctaRow}>
          <a href="#open-source" className={styles.ctaPrimary}>
            Clone & self-host
            <ArrowRight className={styles.ctaIcon} />
          </a>
          <Link href={HOME_PATH} className={styles.ctaSecondary}>
            See the dashboard
          </Link>
        </div>
        <div className={styles.stats}>
          {LANDING_HERO_STATS.map((s) => (
            <div key={s.k} className={styles.statCell}>
              <div className={styles.statValue}>{s.k}</div>
              <div className={styles.statLabel}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: `
    relative overflow-hidden border-b border-border
  `,
  gridOverlay: `
    absolute inset-0 grid-overlay
  `,
  topLine: `
    absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent
  `,
  inner: `
    relative mx-auto max-w-6xl px-6 py-28
    lg:px-8
    lg:py-36
  `,
  kicker: `
    mono-label text-primary
  `,
  heading: `
    mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-foreground
    sm:text-6xl
    lg:text-7xl
  `,
  accent: `
    text-primary
  `,
  sub: `
    mt-8 max-w-2xl text-lg text-muted-foreground
    sm:text-xl
  `,
  ctaRow: `
    mt-10 flex flex-wrap items-center gap-3
  `,
  ctaPrimary: `
    inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium
    text-primary-foreground transition-colors hover:bg-primary-hover
  `,
  ctaIcon: `
    h-4 w-4
  `,
  ctaSecondary: `
    inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-3
    text-sm font-medium transition-colors hover:border-foreground/30 hover:bg-secondary
  `,
  stats: `
    mt-20 grid grid-cols-1 divide-y divide-border border-y border-border
    sm:grid-cols-3 sm:divide-x sm:divide-y-0
  `,
  statCell: `
    px-2 py-6
    sm:px-8
  `,
  statValue: `
    text-2xl font-semibold text-foreground
  `,
  statLabel: `
    mt-1 mono-label text-muted-foreground
  `,
} as const;
