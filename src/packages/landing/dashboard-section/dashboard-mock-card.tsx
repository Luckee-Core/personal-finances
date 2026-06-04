import { ArrowDownRight } from 'lucide-react';

const CHART_BAR_CLASSES = [
  'h-10',
  'h-16',
  'h-8',
  'h-20',
  'h-14',
  'h-24',
  'h-[4.5rem]',
] as const;

const CATEGORY_WIDTH_CLASSES = ['w-[70%]', 'w-[45%]', 'w-[30%]'] as const;

export const LandingDashboardMockCard = () => {
  return (
    <div className={styles.card}>
      <div className={styles.headerRow}>
        <div>
          <div className={styles.labelMuted}>This month</div>
          <div className={styles.amount}>$4,128.94</div>
          <div className={styles.deltaRow}>
            <ArrowDownRight className={styles.deltaIcon} />
            <span className={styles.deltaValue}>$312.40</span>
            <span className={styles.deltaText}>vs. forward avg $4,441.34</span>
          </div>
        </div>
        <div className={styles.forwardBox}>
          <div className={styles.labelMuted}>Forward avg</div>
          <div className={styles.forwardValue}>$4,441.34</div>
        </div>
      </div>

      <div className={styles.chart}>
        {CHART_BAR_CLASSES.map((barClass, i) => (
          <div key={i} className={styles.chartTrack}>
            <div className={`${styles.chartFill} ${barClass}`} />
          </div>
        ))}
      </div>

      <div className={styles.upcoming}>
        <div className={styles.upcomingHeader}>
          <div className={styles.labelMuted}>Upcoming week</div>
          <span className={styles.upcomingMeta}>5 items · $612.18</span>
        </div>
        <ul className={styles.upcomingList}>
          {[
            { name: 'Rent', tag: 'Recurring', amt: '$1,850.00' },
            { name: 'Spotify Family', tag: 'Recurring', amt: '$16.99' },
            { name: 'Dentist visit', tag: 'Anticipated', amt: '$220.00' },
            { name: 'Car insurance', tag: 'Recurring', amt: '$142.75' },
          ].map((r) => (
            <li key={r.name} className={styles.upcomingItem}>
              <div className={styles.upcomingItemLeft}>
                <span className={styles.upcomingName}>{r.name}</span>
                <span className={styles.upcomingTag}>{r.tag}</span>
              </div>
              <span className={styles.tabular}>{r.amt}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.bottomGrid}>
        <div className={styles.bottomCard}>
          <div className={styles.labelMuted}>Top categories</div>
          <ul className={styles.categoryList}>
            {[
              { c: 'Groceries', v: '$612.45', w: CATEGORY_WIDTH_CLASSES[0] },
              { c: 'Dining', v: '$284.10', w: CATEGORY_WIDTH_CLASSES[1] },
              { c: 'Transport', v: '$198.22', w: CATEGORY_WIDTH_CLASSES[2] },
            ].map((x) => (
              <li key={x.c}>
                <div className={styles.categoryRow}>
                  <span>{x.c}</span>
                  <span className={styles.categoryAmount}>{x.v}</span>
                </div>
                <div className={styles.categoryTrack}>
                  <div className={`${styles.categoryFill} ${x.w}`} />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.bottomCard}>
          <div className={styles.labelMuted}>Recent</div>
          <ul className={styles.recentList}>
            {[
              { d: 'Jun 02', n: 'Whole Foods', a: '-$87.34', pos: false },
              { d: 'Jun 02', n: 'Lyft', a: '-$14.20', pos: false },
              { d: 'Jun 01', n: 'Payroll', a: '+$3,420.00', pos: true },
              { d: 'May 31', n: 'AT&T', a: '-$72.99', pos: false },
            ].map((t) => (
              <li key={t.n} className={styles.recentItem}>
                <span className={styles.recentDate}>{t.d}</span>
                <span className={styles.recentName}>{t.n}</span>
                <span className={t.pos ? styles.recentAmountPos : styles.tabular}>{t.a}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: `
    rounded-xl border border-border bg-card p-6 shadow-sm
  `,
  headerRow: `
    flex items-center justify-between
  `,
  labelMuted: `
    mono-label text-muted-foreground
  `,
  amount: `
    mt-2 text-3xl font-semibold
  `,
  deltaRow: `
    mt-1 flex items-center gap-1 text-xs text-muted-foreground
  `,
  deltaIcon: `
    h-3.5 w-3.5 text-primary
  `,
  deltaValue: `
    font-medium text-primary
  `,
  deltaText: `
  `,
  forwardBox: `
    rounded-md border border-border bg-secondary px-3 py-2
  `,
  forwardValue: `
    mt-1 text-sm font-semibold
  `,
  chart: `
    mt-6 grid h-24 grid-cols-7 items-end gap-1.5
  `,
  chartTrack: `
    flex h-full flex-col justify-end rounded-sm bg-primary/15
  `,
  chartFill: `
    rounded-sm bg-primary/80
  `,
  upcoming: `
    mt-6 rounded-lg border border-border bg-secondary/40 p-4
  `,
  upcomingHeader: `
    flex items-center justify-between
  `,
  upcomingMeta: `
    text-xs text-muted-foreground
  `,
  upcomingList: `
    mt-3 space-y-2 text-sm
  `,
  upcomingItem: `
    flex items-center justify-between rounded-md border border-border bg-background px-3 py-2
  `,
  upcomingItemLeft: `
    flex items-center gap-3
  `,
  upcomingName: `
    font-medium
  `,
  upcomingTag: `
    mono-label text-muted-foreground
  `,
  tabular: `
    tabular-nums
  `,
  bottomGrid: `
    mt-4 grid grid-cols-2 gap-3
  `,
  bottomCard: `
    rounded-lg border border-border p-4
  `,
  categoryList: `
    mt-3 space-y-2 text-sm
  `,
  categoryRow: `
    flex justify-between text-xs
  `,
  categoryAmount: `
    tabular-nums text-muted-foreground
  `,
  categoryTrack: `
    mt-1 h-1.5 rounded-full bg-secondary
  `,
  categoryFill: `
    h-full rounded-full bg-primary
  `,
  recentList: `
    mt-3 space-y-2 text-xs
  `,
  recentItem: `
    flex items-center justify-between gap-2
  `,
  recentDate: `
    mono-label w-12 text-muted-foreground
  `,
  recentName: `
    flex-1 truncate
  `,
  recentAmountPos: `
    tabular-nums text-primary
  `,
} as const;
