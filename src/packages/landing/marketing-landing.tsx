import { LandingActivitySection } from './activity-section';
import { LandingAiSection } from './ai-section';
import { LandingDashboardSection } from './dashboard-section';
import { LandingFinalCta } from './final-cta';
import { LandingFooter } from './footer';
import { LandingHero } from './hero';
import { LandingNav } from './nav';
import { LandingOpenSourceSection } from './open-source-section';
import { LandingPlanningSection } from './planning-section';

export const MarketingLanding = () => {
  return (
    <div className={styles.page}>
      <LandingNav />
      <main>
        <LandingHero />
        <LandingDashboardSection />
        <LandingActivitySection />
        <LandingPlanningSection />
        <LandingAiSection />
        <LandingOpenSourceSection />
        <LandingFinalCta />
      </main>
      <LandingFooter />
    </div>
  );
};

const styles = {
  page: `
    min-h-screen bg-background text-foreground antialiased
  `,
} as const;
