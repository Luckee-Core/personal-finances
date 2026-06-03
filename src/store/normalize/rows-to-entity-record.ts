export const rowsToEntityRecord = <T extends { id: string }>(
  rows: T[],
): Record<string, T> => {
  const next: Record<string, T> = {};
  for (const row of rows) {
    next[row.id] = row;
  }
  return next;
};
