import { Building2, CalendarClock, Landmark, Repeat } from 'lucide-react';
import { LandingSectionLabel } from '../components';
import { LANDING_PLANNING_ITEMS } from '../content/landing-content';

const PLANNING_ICONS = {
  recurring: Repeat,
  anticipated: CalendarClock,
  loans: Landmark,
  vendors: Building2,
} as const;

export const LandingPlanningSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <LandingSectionLabel number="03" label="Planning" tone="dark" />
        <div className={styles.grid}>
          <div className={styles.copy}>
            <h2 className={styles.heading}>Plan the bills you already know are coming.</h2>
            <p className={styles.lead}>
              Detect recurring purchases automatically, mark exceptions, and keep an honest view of
              what&apos;s locked in next month.
            </p>
            <div className={styles.cliChip}>
              <span className={styles.cliPrompt}>$</span>
              <span className={styles.cliCmd}>npm run dev</span>
              <span className={styles.cliSep}>·</span>
              <span className={styles.cliHint}>express + supabase</span>
            </div>
          </div>
          <div className={styles.cards}>
            {LANDING_PLANNING_ITEMS.map((it) => {
              const Icon = PLANNING_ICONS[it.key];
              return (
                <div key={it.key} className={styles.card}>
                  <Icon className={styles.cardIcon} />
                  <div className={styles.cardTitle}>{it.title}</div>
                  <p className={styles.cardDesc}>{it.description}</p>
                </div>
              );
            })}
            <div className={styles.tuningCard}>
              <div className={styles.tuningLabel}>Tuning</div>
              <div className={styles.tuningTitle}>&quot;Mark not recurring&quot;</div>
              <p className={styles.tuningDesc}>
                Teach the detector with a single click. Your overrides feed back into future imports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: `
    border-b border-border bg-foreground text-white
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
    mt-6 text-lg text-white/70
  `,
  cliChip: `
    mt-8 inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-1.5
    font-mono text-xs
  `,
  cliPrompt: `
    text-primary
  `,
  cliCmd: `
    text-white/80
  `,
  cliSep: `
    text-white/30
  `,
  cliHint: `
    text-white/50
  `,
  cards: `
    grid grid-cols-1 gap-4
    sm:grid-cols-2
    lg:col-span-7
  `,
  card: `
    rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-colors
    hover:border-primary/40 hover:bg-white/[0.06]
  `,
  cardIcon: `
    h-5 w-5 text-primary
  `,
  cardTitle: `
    mt-4 font-semibold
  `,
  cardDesc: `
    mt-2 text-sm text-white/60
  `,
  tuningCard: `
    rounded-xl border border-white/10 bg-white/[0.03] p-6
    sm:col-span-2
  `,
  tuningLabel: `
    mono-label text-primary
  `,
  tuningTitle: `
    mt-2 font-semibold
  `,
  tuningDesc: `
    mt-2 text-sm text-white/60
  `,
} as const;
