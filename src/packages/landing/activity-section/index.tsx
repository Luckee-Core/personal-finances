import { Check, Upload } from 'lucide-react';
import { LandingSectionLabel } from '../components';
import { LANDING_ACTIVITY_POINTS } from '../content/landing-content';

export const LandingActivitySection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <LandingSectionLabel number="02" label="Activity" />
        <div className={styles.grid}>
          <div>
            <h2 className={styles.heading}>Pull in statements. Let AI do the boring part.</h2>
            <p className={styles.lead}>
              Drop a CSV, review the parsed rows, and let your own prompts handle slugs and
              categories. Every change is yours to override.
            </p>
            <ul className={styles.points}>
              {LANDING_ACTIVITY_POINTS.map((p) => (
                <li key={p} className={styles.point}>
                  <span className={styles.checkWrap}>
                    <Check className={styles.checkIcon} />
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.card}>
            <div className={styles.dropzone}>
              <Upload className={styles.uploadIcon} />
              <div className={styles.dropTitle}>Import CSV</div>
              <div className={styles.dropHint}>
                Drop a statement from your bank or credit card
              </div>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr className={styles.theadRow}>
                    <th className={styles.th}>Date</th>
                    <th className={styles.th}>Description</th>
                    <th className={styles.thRight}>Amount</th>
                    <th className={styles.th}>Category</th>
                  </tr>
                </thead>
                <tbody className={styles.tbody}>
                  {[
                    { d: '05/28', n: "TRADER JOE'S #182", a: '-$54.21', c: 'Groceries' },
                    { d: '05/28', n: 'UBER *TRIP', a: '-$18.40', c: 'Transport' },
                    { d: '05/27', n: 'NETFLIX.COM', a: '-$15.49', c: 'Subscriptions' },
                    { d: '05/26', n: 'STARBUCKS #4421', a: '-$6.75', c: 'Dining' },
                    { d: '05/25', n: 'ACME PAYROLL', a: '+$3,420.00', c: 'Income' },
                  ].map((r) => (
                    <tr key={r.n}>
                      <td className={styles.tdMuted}>{r.d}</td>
                      <td className={styles.td}>{r.n}</td>
                      <td className={styles.tdRight}>{r.a}</td>
                      <td className={styles.td}>
                        <span className={styles.pill}>{r.c}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
    lg:grid-cols-2 lg:gap-16
  `,
  heading: `
    text-4xl font-semibold tracking-tight
    sm:text-5xl
  `,
  lead: `
    mt-6 text-lg text-muted-foreground
  `,
  points: `
    mt-8 space-y-3
  `,
  point: `
    flex items-start gap-3 text-sm
  `,
  checkWrap: `
    mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary
  `,
  checkIcon: `
    h-3.5 w-3.5
  `,
  card: `
    rounded-xl border border-border bg-card p-6 shadow-sm
  `,
  dropzone: `
    rounded-lg border border-dashed border-border bg-secondary/50 p-6 text-center
  `,
  uploadIcon: `
    mx-auto h-6 w-6 text-primary
  `,
  dropTitle: `
    mt-3 text-sm font-medium
  `,
  dropHint: `
    mt-1 text-xs text-muted-foreground
  `,
  tableWrap: `
    mt-6 overflow-hidden rounded-lg border border-border
  `,
  table: `
    w-full text-xs
  `,
  thead: `
    bg-secondary/60
  `,
  theadRow: `
    text-left
  `,
  th: `
    px-3 py-2 mono-label font-medium text-muted-foreground
  `,
  thRight: `
    px-3 py-2 mono-label text-right font-medium text-muted-foreground
  `,
  tbody: `
    divide-y divide-border
  `,
  td: `
    px-3 py-2
  `,
  tdMuted: `
    px-3 py-2 tabular-nums text-muted-foreground
  `,
  tdRight: `
    px-3 py-2 text-right tabular-nums
  `,
  pill: `
    inline-flex items-center rounded-full border border-border bg-secondary px-2 py-0.5 text-[10px] font-medium
  `,
} as const;
