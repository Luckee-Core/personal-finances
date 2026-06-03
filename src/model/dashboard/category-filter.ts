/** Builder filter value for transactions with no category. */
export const DASHBOARD_UNCATEGORIZED_FILTER = '__uncategorized__';

export const matchesDashboardCategoryFilter = (
  transactionCategoryId: string | null,
  filteredCategory: string | null,
): boolean => {
  if (filteredCategory === null) return true;
  if (filteredCategory === DASHBOARD_UNCATEGORIZED_FILTER) {
    return transactionCategoryId === null;
  }
  return transactionCategoryId === filteredCategory;
};

export const toDashboardCategoryFilterValue = (categoryId: string | null): string =>
  categoryId ?? DASHBOARD_UNCATEGORIZED_FILTER;
