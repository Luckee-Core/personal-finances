import { LandingSectionLabel } from '../components';
import { LANDING_AI_PROMPTS } from '../content/landing-content';

export const LandingAiSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <LandingSectionLabel number="04" label="Settings" />
        <div className={styles.grid}>
          <div className={styles.copy}>
            <h2 className={styles.heading}>AI you actually control.</h2>
            <p className={styles.lead}>
              Three prompt types, versioned and activatable. Audit every request on the AI Costs page
              with 30, 90, and 365-day views.
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <span className={styles.bullet}>→</span>
                Versioned prompts — pin or revert anytime
              </li>
              <li className={styles.listItem}>
                <span className={styles.bullet}>→</span>
                Per-request token & cost tracking
              </li>
              <li className={styles.listItem}>
                <span className={styles.bullet}>→</span>
                30 / 90 / 365-day cost windows
              </li>
            </ul>
          </div>
          <div className={styles.mock}>
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div className={styles.labelMuted}>Prompts</div>
                <div className={styles.labelMuted}>Tokens · Cost (30d)</div>
              </div>
              <ul className={styles.promptList}>
                {LANDING_AI_PROMPTS.map((p) => (
                  <li key={p.name} className={styles.promptRow}>
                    <div className={styles.promptMain}>
                      <div className={styles.promptTitleRow}>
                        <span className={styles.promptName}>{p.name}</span>
                        {p.active ? (
                          <span className={styles.activeBadge}>Activate · v3</span>
                        ) : null}
                      </div>
                      <p className={styles.promptDesc}>{p.desc}</p>
                    </div>
                    <div className={styles.promptStats}>
                      <div className={styles.promptTokens}>{p.tokens}</div>
                      <div className={styles.labelMuted}>{p.cost}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className={styles.panelFooter}>
                Audit: <span className={styles.footerEm}>slug assign</span> ·{' '}
                <span className={styles.footerEm}>category assign</span> ·{' '}
                <span className={styles.footerEm}>recurring detect</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: `
    border-b border-border
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
  list: `
    mt-8 space-y-3 text-sm text-muted-foreground
  `,
  listItem: `
    flex gap-3
  `,
  bullet: `
    text-primary
  `,
  mock: `
    lg:col-span-7
  `,
  panel: `
    overflow-hidden rounded-xl border border-border bg-card shadow-sm
  `,
  panelHeader: `
    flex items-center justify-between border-b border-border px-5 py-3
  `,
  labelMuted: `
    mono-label text-muted-foreground
  `,
  promptList: `
    divide-y divide-border
  `,
  promptRow: `
    flex items-center justify-between gap-4 px-5 py-4
  `,
  promptMain: `
    min-w-0
  `,
  promptTitleRow: `
    flex items-center gap-2
  `,
  promptName: `
    font-mono text-sm
  `,
  activeBadge: `
    inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary
  `,
  promptDesc: `
    mt-1 truncate text-xs text-muted-foreground
  `,
  promptStats: `
    shrink-0 text-right
  `,
  promptTokens: `
    tabular-nums text-sm
  `,
  panelFooter: `
    border-t border-border bg-secondary/40 px-5 py-3 text-xs text-muted-foreground
  `,
  footerEm: `
    text-foreground
  `,
} as const;
