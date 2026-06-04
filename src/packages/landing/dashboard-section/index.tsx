import { LandingSectionLabel } from '../components';
import { LandingDashboardMockCard } from './dashboard-mock-card';

export const LandingDashboardSection = () => {
  return (
    <section id="features" className={styles.section}>
      <div className={styles.inner}>
        <LandingSectionLabel number="01" label="Overview" />
        <div className={styles.grid}>
          <div className={styles.copy}>
            <h2 className={styles.heading}>One dashboard for spend and commitments.</h2>
            <p className={styles.lead}>
              Monthly spend, forward averages, and the week ahead — recurring bills and anticipated
              costs in one view, so nothing surprises you on the 28th.
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <span className={styles.bullet}>→</span>
                Monthly + forward monthly average
              </li>
              <li className={styles.listItem}>
                <span className={styles.bullet}>→</span>
                Upcoming week: recurring & anticipated
              </li>
              <li className={styles.listItem}>
                <span className={styles.bullet}>→</span>
                Category breakdown with drill-down
              </li>
              <li className={styles.listItem}>
                <span className={styles.bullet}>→</span>
                Recent transactions feed
              </li>
            </ul>
          </div>
          <div className={styles.mock}>
            <LandingDashboardMockCard />
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
} as const;
