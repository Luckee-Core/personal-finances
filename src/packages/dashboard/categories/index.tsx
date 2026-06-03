'use client';

import { useMemo } from 'react';
import { getDashboardTimePeriodLabel } from '@/model/dashboard/time-period';
import { useAppSelector } from '@/store/hooks';
import { DashboardCategoryCard } from './card';

export const DashboardCategoriesSection = () => {
  const categoriesRecord = useAppSelector((state) => state.categories);
  const timePeriod = useAppSelector((state) => state.dashboardBuilder.timePeriod);

  const categories = useMemo(
    () =>
      Object.values(categoriesRecord).sort((a, b) => a.name.localeCompare(b.name)),
    [categoriesRecord],
  );

  const periodLabel = getDashboardTimePeriodLabel(timePeriod);

  return (
    <section className={styles.section}>
      <div>
        <h2 className={styles.heading}>Categories</h2>
        <p className={styles.subheading}>{periodLabel}</p>
      </div>
      {categories.length === 0 ? (
        <p className={styles.empty}>No categories yet.</p>
      ) : (
        <div className={styles.cardGrid}>
          {categories.map((category) => (
            <DashboardCategoryCard key={category.id} categoryId={category.id} />
          ))}
          <DashboardCategoryCard categoryId={null} />
        </div>
      )}
    </section>
  );
};

const styles = {
  section: `
    space-y-3
  `,
  heading: `
    text-lg font-semibold text-gray-900
  `,
  subheading: `
    text-sm text-gray-500
  `,
  empty: `
    text-sm text-gray-500
  `,
  cardGrid: `
    grid gap-2
    sm:grid-cols-3
    lg:grid-cols-4
    xl:grid-cols-5
    2xl:grid-cols-6
  `,
} as const;
